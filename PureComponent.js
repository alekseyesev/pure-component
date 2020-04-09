const PureComponent = (props, render, componentWillMount) => {
    const self = PureComponent;
    const checkEquality = ({ prevProps, newProps }) => {
      let propsIsEqual = false;
      if (typeof prevProps === "object" && typeof newProps === "object") {
        prevProps = Object.entries(prevProps);
        propsIsEqual =
          prevProps.length === Object.entries(newProps).length &&
          prevProps
            .reduce(
              (equalityChecker, [propName, propValue]) =>
                equalityChecker.push(
                  newProps[propName] && Object.is(newProps[propName], propValue)
                ) && equalityChecker,
              []
            )
            .every((equality) => equality === true);
      }
      return propsIsEqual;
    };
  
    return (() => {
      const propsIsEqual = checkEquality({
        prevProps: self.props,
        newProps: props,
      });
  
      if (typeof componentWillMount === "function") {
        self.componentWillMount = componentWillMount;
      }
  
      if (typeof self.componentWillMount === "function") {
        self.componentWillMount({
          propsIsEqual,
          prevProps: self.props,
          newProps: props,
        });
      }
  
      self.props = props;
  
      if (typeof render === "function" && render(props)) {
        self.render = render;
      }
  
      if (!propsIsEqual) {
        self.cache =
          (typeof self.render === "function" && self.render(props)) || null;
      }
  
      if (!self.cache) {
        throw new TypeError(
          "Please, give to the component a valid render function, that returns non-empty string."
        );
      }
  
      return self.cache;
    })();
  };
  
  let component = PureComponent(
    { innerText: "State 1" },
    ({ innerText }) => `<div class="component">${innerText}</div>`,
    ({ propsIsEqual, prevProps, newProps }) => {
      const messages = [
        propsIsEqual
          ? "No need to rerender the component."
          : typeof prevProps === "undefined"
          ? "The component should be rendered first time."
          : "The component should be rendered again.",
        `Previous props: ${prevProps && JSON.stringify(prevProps)}`,
        `Next props: ${newProps && JSON.stringify(newProps)}`,
      ];
      console.log(...messages);
    }
  );                                                   // The component should be rendered first time. Previous props: undefined Next props: {"innerText":"Состояние 1"}
  
  component = PureComponent({ innerText: "State 1" }); // No need to rerender the component. Previous props: {"innerText":"Состояние 1"} Next props: {"innerText":"Состояние 1"}
  
  component = PureComponent({ innerText: "State 2" }); // The component should be rendered again. Previous props: {"innerText":"Состояние 1"} Next props: {"innerText":"Состояние 2"}
  