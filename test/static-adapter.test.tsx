import * as React from 'react';
import { shallow } from 'enzyme';
import { observer } from 'mobx-react';
import { StaticAdapter } from '../src';
import { Route, RouterState, RouterStore } from '../src/router-store';

const routes = [
    { name: 'home', pattern: '/' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'notFound', pattern: '/not-found' }
];

const home = new RouterState('home');
const notFound = new RouterState('notFound');
const dept1 = new RouterState('department', { id: 'dept1' });
const dept2 = new RouterState('department', { id: 'dept2' });

const routerStore = new RouterStore({}, routes, notFound);
const location = '/departments/dept1';
const locationNotFound = '/departmenasdts/dept1';
const locationWithoutParams = '/';

@observer
class DepartmentsPage extends React.Component {
    render() {
        const { routerState: { params, routeName } } = routerStore;

        return (
            <div>
                {params.id === 'dept1' && <div id="tab">Dept 1 Content</div>}
                {params.id === 'dept2' && <div id="tab">Dept 2 Content</div>}
                {routeName === 'notFound' && <div id="tab">Not Found</div>}
                {routeName === 'without params' && (
                    <div id="tab">Without params</div>
                )}
            </div>
        );
    }
}

describe('RouterStore', () => {
    test('With match url', () => {
        const staticAdapter = new StaticAdapter(routerStore, location);
        return staticAdapter.preload().then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual('Dept 1 Content');
        });
    });

    test('Without match url', () => {
        const staticAdapter = new StaticAdapter(routerStore, locationNotFound);
        return staticAdapter.preload().then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual('Not Found');
        });
    });

    test('Test ENV', () => {
        process.env.NODE_ENV = 'development';
        const staticAdapter = new StaticAdapter(routerStore, location);
        return staticAdapter.preload().then(() => {
            const wrapper = shallow(<DepartmentsPage />);
            expect(wrapper.find('#tab').text()).toEqual('Dept 1 Content');
        });
    });
});
