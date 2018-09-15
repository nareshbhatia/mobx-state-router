import * as React from 'react';
import { shallow } from 'enzyme';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { StaticAdapter } from '../src/adapters/static-adapter';
import { Route, RouterState, RouterStore } from '../src/router-store';
import { createLocation } from 'history';

const itemValue = `Hello World`;
class RootStore {
    @observable
    item: string = '';
    @action
    loadItem() {
        return new Promise(resolve => {
            // emulate async load
            setTimeout(() => {
                runInAction(() => {
                    this.item = itemValue;
                    resolve();
                });
            }, 500);
        });
    }
}

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    {
        name: 'department',
        pattern: '/departments/:id'
    },
    {
        name: 'beforeEnter',
        pattern: '/before-enter',
        beforeEnter: (fromState, toState, routerStore) => {
            const rootStore = routerStore.rootStore;
            return rootStore.loadItem();
        }
    },
    { name: 'notFound', pattern: '/not-found' }
];

const rootStore = new RootStore();
const home = new RouterState('home');
const beforeEnter = new RouterState('beforeEnter');
const notFound = new RouterState('notFound');
const dept1 = new RouterState('department', { id: 'dept1' });
const dept2 = new RouterState('department', { id: 'dept2' });

const routerStore = new RouterStore(rootStore, routes, notFound);

const dept1Location = createLocation('/departments/dept1');
const beforeEnterLocation = createLocation('/before-enter');
const unknownLocation = createLocation('/departmentions/dept1');

@observer
class DepartmentsPage extends React.Component {
    render() {
        const {
            rootStore,
            routerState: { params, routeName }
        } = routerStore;
        const item = rootStore.item;
        return (
            <div>
                {params.id === 'dept1' && <div id="tab">Dept 1 Content</div>}
                {params.id === 'dept2' && <div id="tab">Dept 2 Content</div>}
                {routeName === 'notFound' && <div id="tab">Not Found</div>}
                {routeName === 'without params' && (
                    <div id="tab">Without params</div>
                )}
                {routeName === 'beforeEnter' && <div id="tab">{item}</div>}
            </div>
        );
    }
}

describe('StaticAdapter', () => {
    test('goes correctly to a known location', () => {
        const staticAdapter = new StaticAdapter(routerStore);
        return staticAdapter.goToLocation(dept1Location).then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual('Dept 1 Content');
        });
    });

    test('goes to Not Found if asked to go to an unknown location', () => {
        const staticAdapter = new StaticAdapter(routerStore);
        return staticAdapter.goToLocation(unknownLocation).then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual('Not Found');
        });
    });

    test('runs beforeEnter hook before going to target location', () => {
        const staticAdapter = new StaticAdapter(routerStore);
        return staticAdapter.goToLocation(beforeEnterLocation).then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual(itemValue);
        });
    });
});
