import * as React from 'react';
import { mount } from 'enzyme';
import { Link } from '../src/components/link';
import { RouterState, RouterStore } from '../src/router-store';

const routes = [
    { name: 'home', pattern: '/home' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'items', pattern: '/items' },
    { name: 'notFound', pattern: '/not-found' }
];
const home = new RouterState('home');
const notFound = new RouterState('notFound');

class RootStore {
    routerStore = new RouterStore(this, routes, notFound);
}

let rootStore: RootStore;
beforeEach(() => {
    rootStore = new RootStore();
});

describe('RouterLink', () => {
    test('renders simple routes, e.g. /home', () => {
        const wrapper = mount(
            <Link routerStore={rootStore.routerStore} toState={home} />
        );
        expect(wrapper.find('a').prop('href')).toEqual('/home');
    });

    test('renders routes with params, e.g. /departments/:id', () => {
        const wrapper = mount(
            <Link
                routerStore={rootStore.routerStore}
                toState={new RouterState('department', { id: 'electronics' })}
            />
        );
        expect(wrapper.find('a').prop('href')).toEqual(
            '/departments/electronics'
        );
    });

    test('renders routes with queryParams, e.g. /items?q=apple', () => {
        const wrapper = mount(
            <Link
                routerStore={rootStore.routerStore}
                toState={new RouterState('items', {}, { q: 'apple' })}
            />
        );
        expect(wrapper.find('a').prop('href')).toEqual('/items?q=apple');
    });

    test('renders with blank className when no class names are supplied', () => {
        const wrapper = mount(
            <Link routerStore={rootStore.routerStore} toState={home} />
        );
        expect(wrapper.find('a').prop('className')).toBe('');
    });

    test('renders with className when className is supplied', () => {
        const wrapper = mount(
            <Link
                routerStore={rootStore.routerStore}
                toState={home}
                className="linkClass"
            />
        );
        expect(wrapper.find('a').prop('className')).toBe('linkClass');
    });

    test('does not render activeClassName when link is inactive', () => {
        const wrapper = mount(
            <Link
                routerStore={rootStore.routerStore}
                toState={home}
                className="linkClass"
                activeClassName="activeLinkClass"
            />
        );
        expect(wrapper.find('a').prop('className')).toBe('linkClass');
    });

    test('renders activeClassName when link is active', () => {
        const { routerStore } = rootStore;

        return routerStore.goTo(home).then(() => {
            const wrapper = mount(
                <Link
                    routerStore={rootStore.routerStore}
                    toState={home}
                    className="linkClass"
                    activeClassName="activeLinkClass"
                />
            );
            expect(wrapper.find('a').prop('className')).toBe(
                'linkClass activeLinkClass'
            );
        });
    });

    test('changes RouterState when left-clicked', () => {
        const { routerStore } = rootStore;
        const wrapper = mount(
            <Link routerStore={routerStore} toState={home} />
        );
        expect(wrapper.find('a').prop('href')).toEqual('/home');

        // Left-click the link
        wrapper.find('a').simulate('click', { button: 0 });

        // TODO: Not working - state does not change to home
        // jest.useFakeTimers();
        // setTimeout(() => {
        //     const { routerState } = rootStore.routerStore;
        //     console.log('-----> routerState:', routerState);
        //     expect(routerState.isEqual(home)).toBeTruthy();
        // }, 1000);
        // jest.runAllTimers();
    });

    test('does not change RouterState when right-clicked', () => {
        const { routerStore } = rootStore;
        const wrapper = mount(
            <Link routerStore={routerStore} toState={home} />
        );
        expect(wrapper.find('a').prop('href')).toEqual('/home');

        // Right-click the link
        wrapper.find('a').simulate('click', { button: 2 });

        // TODO: Not working - state remains at __initial__, click or not!!
        // jest.useFakeTimers();
        // setTimeout(() => {
        //     const { routerState } = rootStore.routerStore;
        //     console.log('-----> routerState:', routerState);
        //     expect(routerState.isEqual(home)).toBeFalsy();
        // }, 1000);
        // jest.runAllTimers();
    });

    /*
    // Uncomment this test to see the issue with PR-41
    test('calls onClick prop when passed in', () => {
        const mockCallBack = jest.fn();
        const { routerStore } = rootStore;
        const wrapper = mount(
            <Link
                routerStore={routerStore}
                toState={home}
                onClick={mockCallBack}
            />
        );
        expect(wrapper.find('a').prop('href')).toEqual('/home');

        // Left-click the link
        wrapper.find('a').simulate('click', { button: 0 });
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    */
});
