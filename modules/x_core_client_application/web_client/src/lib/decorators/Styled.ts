import { ClassType, Component, ComponentState } from "react";

import { StyleRules,  StyleRulesCallback, withStyles } from "@material-ui/core/styles";
import { WithStylesOptions } from "@material-ui/core/styles/withStyles";

/*
 * Inject classNames object for JSS styled components.
 */
export function Styled<P1, T1 extends Component<P1, ComponentState>, ClassKey extends string, Options extends WithStylesOptions<ClassKey> = {}>(
  style: StyleRulesCallback<ClassKey> | StyleRules<ClassKey>, options?: Options): (target: ClassType<P1, T1, any>) => ClassType<P1, T1, any> {

  return (target: ClassType<P1, T1, any>): ClassType<P1, T1, any> => {
    return withStyles(style, options)(target);
  };

}
