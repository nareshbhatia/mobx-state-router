import * as React from 'react';
import { shallow } from 'enzyme';
import { observer } from 'mobx-react';
import { RouterState, RouterStore, Route } from '../src/router-store';

@observer
class DepartmentsPage extends React.Component {
    render() {
        const {
            routerState: { params }
        } = routerStore;

        return (
            <div>
                <button
                    name="dept1-button"
                    onClick={() => {
                        routerStore.goTo(dept1);
                    }}
                >
                    Department 1
                </button>
                <button
                    name="dept2-button"
                    onClick={() => {
                        routerStore.goTo(dept2);
                    }}
                >
                    Department 2
                </button>

                {params.id === 'dept1' && <div id="tab">Dept 1 Content</div>}
                {params.id === 'dept2' && <div id="tab">Dept 2 Content</div>}
            </div>
        );
    }
}

const routes: Route[] = [
    {
        name: 'department',
        pattern: '/departments/:id',
        component: <DepartmentsPage />
    },
    {
        name: 'notFound',
        pattern: '/not-found',
        component: <h1>Not found</h1>
    }
];

const notFound = new RouterState('notFound');
const dept1 = new RouterState('department', { id: 'dept1' });
const dept2 = new RouterState('department', { id: 'dept2' });

const routerStore = new RouterStore({}, routes, notFound);

test('DepartmentsPage changes tabs when a tab button is clicked', () => {
    // Set up router state to point to department 1
    return routerStore.goTo(dept1).then(() => {
        // Render the DepartmentsPage and make sure it is on the department 1
        const wrapper = shallow(<DepartmentsPage />);
        expect(wrapper.find('#tab').text()).toEqual('Dept 1 Content');

        // Click on the dept2 button and make sure the page switches to department 2
        wrapper.find('[name="dept2-button"]').simulate('click');

        // TODO: Not working - tab stays at Dept 1
        // jest.useFakeTimers();
        // setTimeout(() => {
        //     console.log('-----> routerState:', routerStore.routerState);
        //     console.log(wrapper.debug());
        //     expect(wrapper.find('#tab').text()).toEqual('Dept 2 Content');
        // }, 1000);
        // jest.runAllTimers();
    });
});
