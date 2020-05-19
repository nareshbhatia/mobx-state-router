import React from 'react';
import orderList from '../assets/order-list.png';
import './HomePage.css';

export const HomePage = () => (
    <div className="content">
        <h1 className="title">Sharing UI Components with Yarn Workspaces</h1>

        <p>
            Today’s popular front-end frameworks like Angular and React allow us
            to create rich web applications using modular, reusable components.
            Most of the time we get away with reusing components that someone
            else wrote. Angular Material, Material-UI and Glamorous are just a
            few examples of the many off-the-shelf component libraries that
            allow us to build rich web applications with minimal effort. We
            generally don’t think about writing shared reusable components until
            we have to write moderately complex applications. In my case, our
            team was tasked to write a set of reusable components so that they
            can be used to quickly compose a suite of complex financial
            applications. I started thinking about the best way to create these
            components.
        </p>

        <h2>Motivation: Faster Development Cycle</h2>

        <p>
            Imagine that you were writing an online shopping app. There’s a page
            in this app that shows the list of orders. The OrderList component
            uses the List component from the Material-UI library. Your component
            hierarchy might look like this:
        </p>

        <img src={orderList} alt="Order List" className="home__image" />
    </div>
);
