import { Bind, Consume } from "dreamstate";

import * as React from "react";
import { ChangeEvent, Component, KeyboardEvent, ReactNode } from "react";

// Lib.
import { Styled } from "@Lib/decorators";
import { Optional } from "@Lib/ts/types";

// Data.
import { authContextManager, IAuthContext, IRouterContext } from "@Main/data/store";
import { authenticationConfig } from "@Module/authentication/data/AuthenticationConfig";

// View.
import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  LinearProgress
} from "@material-ui/core";
import { WithStyles } from "@material-ui/core";
import { loginFormStyle } from "./LoginForm.Style";

// Props.
export interface ILoginFormState {
  usernameInput: {
    edited: boolean;
    error: Optional<string>;
    value: string;
  };
  passwordInput: {
    edited: boolean;
    error: Optional<string>;
    value: string;
  };
}

export interface ILoginFormOwnProps {}
export interface ILoginFormInjectedProps extends WithStyles<typeof loginFormStyle>, IAuthContext, IRouterContext {}
export interface ILoginFormProps extends ILoginFormOwnProps, ILoginFormInjectedProps {}

@Consume(authContextManager)
@Styled(loginFormStyle)
export class LoginForm extends Component<ILoginFormProps, ILoginFormState> {

  public state: ILoginFormState = {
    passwordInput: {
      edited: false,
      error: null,
      value: ""
    },
    usernameInput: {
      edited: false,
      error: null,
      value: ""
    }
  };

  public componentWillUnmount(): void {

    const { authActions: { cleanupErrorMessage } } = this.props;

    cleanupErrorMessage();
  }

  public render(): ReactNode {

    const { classes } = this.props;

    return (
      <Card className={classes.root}>
        {this.renderLoadingProgressBar()}
        {this.renderFormBody()}
      </Card>
    );
  }

  private renderLoadingProgressBar(): ReactNode {

    const { classes, authState: { authorizing } } = this.props;

    return authorizing
        ? <LinearProgress color={"secondary"} className={classes.linearLoader}/>
        : <div className={classes.linearLoader}/>;
  }

  private renderFormBody(): ReactNode {

    const { classes, authState: { authorizing, errorMessage } } = this.props;
    const { usernameInput, passwordInput } = this.state;

    return (
      <Grid className={classes.formWrapper} onKeyDown={this.onKeyDown} container>

        <form>

          <FormControl className={classes.textInput} error={Boolean(usernameInput.error)} margin={"normal"}>
            <InputLabel>Username</InputLabel>
            <Input disabled={authorizing} value={usernameInput.value} onChange={this.onUsernameChanged} placeholder={"username"}/>
            <FormHelperText>{usernameInput.error}</FormHelperText>
          </FormControl>

          <FormControl className={classes.textInput} error={Boolean(passwordInput.error) } margin={"normal"}>
            <InputLabel>Password</InputLabel>
            <Input disabled={authorizing} value={passwordInput.value} onChange={this.onPasswordChanged} type={"password"} placeholder={"password"} autoComplete={"current-password"}/>
            <FormHelperText>{passwordInput.error}</FormHelperText>
          </FormControl>

          <Grid justify={"space-between"} alignItems={"center"} container>
            <InputLabel className={classes.errorLabel}>{errorMessage}</InputLabel>
            <Button
              className={classes.signInButton}
              color={"primary"}
              disabled={!this.isFormValid()}
              onClick={this.onFormSubmit}
            >
              Submit
            </Button>
          </Grid>

        </form>

      </Grid>
    );
  }

  @Bind()
  private onUsernameChanged(event: ChangeEvent<HTMLInputElement>): void {

    const { authActions: { cleanupErrorMessage } } = this.props;
    const value: string = event.target.value;

    if (value.length < authenticationConfig.MAX_USERNAME_LENGTH) {

      const error: Optional<string> = value.length < authenticationConfig.MIN_USERNAME_LENGTH
        ? `Username should be longer than ${authenticationConfig.MIN_USERNAME_LENGTH} characters.`
        : null;

      cleanupErrorMessage();

      this.setState({ usernameInput: { value, edited: true, error } });
    }
  }

  @Bind()
  private onPasswordChanged(event: ChangeEvent<HTMLInputElement>): void {

    const { authActions: { cleanupErrorMessage } } = this.props;
    const value: string = event.target.value;

    if (value.length < authenticationConfig.MAX_PASSWORD_LENGTH) {

      const error: Optional<string> = value.length < authenticationConfig.MIN_PASSWORD_LENGTH
        ? `Password should be longer than ${authenticationConfig.MIN_PASSWORD_LENGTH} characters.`
        : null;

      cleanupErrorMessage();

      this.setState({ passwordInput: { value, edited: true, error } });
    }
  }

  @Bind()
  private onKeyDown(event: KeyboardEvent<any>): void {

    if (event.key === "Enter") {
      this.onFormSubmit();
    }
  }

  @Bind()
  private isFormValid(): boolean {

    const { authState: { authorizing, errorMessage } } = this.props;
    const { usernameInput, passwordInput } = this.state;

    return !authorizing && errorMessage === null &&
      usernameInput.edited && passwordInput.edited &&
      !usernameInput.error && !passwordInput.error;
  }

  /*
   * Confirmation.
   */

  @Bind()
  private async onFormSubmit(): Promise<void> {

    const { authActions: { login } } = this.props;
    const { usernameInput, passwordInput } = this.state;

    if (this.isFormValid()) {
      await login(usernameInput.value, passwordInput.value);
    }
  }

}
