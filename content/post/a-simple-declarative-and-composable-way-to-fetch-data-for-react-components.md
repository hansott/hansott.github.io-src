+++
date = "2016-03-14T10:04:00+02:00"
title = "A simple, declarative, and composable way to fetch data for React components"
categories = ["React", "Redux"]
tags = ["React", "Redux"]
+++

[Introducing React Refetch](https://engineering.heroku.com/blogs/2015-12-16-react-refetch/)

> We obviously needed to standardize on a way to load data, but we weren’t really happy with any of our existing methods. Loading data into state made components smarter and more mutable than they needed to be, and these problems only became worse with more data sources. We liked the general idea of unidirectional flow and division of responsibility that the Flux architecture introduced, but it also brought a lot of boilerplate and complexity with it.

> Looking around for alternatives, Redux was the Flux-like library du jour, and it did seem very promising. We loved how the React Redux bindings used pure functions to select state from the store and higher-order functions to inject and bind that state and actions into otherwise stateless components. We started to move down the path of standardizing on Redux, but there was something that felt wrong about loading and reducing data into the global store only to select it back out again. This pattern makes a lot of sense when an application is actually maintaining client-side state that needs to be shared between components or cached in the browser, but when components are just loading data from a server and rendering it, it can be overkill.

### Links
* [React Refetch](https://github.com/heroku/react-refetch)
* [Introducing React Refetch](https://engineering.heroku.com/blogs/2015-12-16-react-refetch/)
* [Redux](http://redux.js.org/)
