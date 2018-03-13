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
const staticAdapter = new StaticAdapter(routerStore, location);

@observer
class DepartmentsPage extends React.Component {
    render() {
        const { routerState: { params } } = routerStore;

        return (
            <div>
                {params.id === 'dept1' && <div id="tab">Dept 1 Content</div>}
                {params.id === 'dept2' && <div id="tab">Dept 2 Content</div>}
            </div>
        );
    }
}

test('StaticAdapter', () => {
    return staticAdapter.preload().then(() => {
        const wrapper = shallow(<DepartmentsPage />);
        expect(wrapper.find('#tab').text()).toEqual('Dept 1 Content');
        // expect(111).toEqual(111);
    });
});
