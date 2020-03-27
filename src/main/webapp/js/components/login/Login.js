'use strict';

import React from "react";
import {Alert, Button, Form, Card} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {Routes} from "../../utils/Routes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {transitionTo} from "../../utils/Routing";
import {login} from "../../actions/AuthActions";
import {LoaderSmall} from "../Loader";
import {deviceIsMobile, deviceIsSupported} from "../../utils/Utils";
import * as Constants from "../../constants/DefaultConstants";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            username: '',
            password: '',
            showAlert: false,
        }
    }

    componentDidMount() {
        this.usernameField.focus();
        this.setState({deviceSupported: deviceIsSupported()});
    }

    onChange = (e) => {
        let state = this.state;
        state[e.target.name] = e.target.value;
        state.alertVisible = false;
        this.setState(state);
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    login = () => {
        this.props.login(this.state.username, this.state.password);
        this.setState({showAlert: true});
    };

    onForgotPassword = () => {
        transitionTo(Routes.passwordReset)
    };

    getSupportedBrowsersLinks() {
        return Constants.SUPPORTED_BROWSERS.map((browser, index) => {
            return <span key={browser.name}>
        {browser.linkMobile && browser.linkDesktop ?
            <a href={deviceIsMobile() ? browser.linkMobile : browser.linkDesktop} target="_blank"
               key="0">{browser.name}</a> : <span>{browser.name}</span>}
                {index <= Constants.SUPPORTED_BROWSERS.length - 3 && <span>, </span>}
                {index === Constants.SUPPORTED_BROWSERS.length - 2 && <span>{this.i18n('or')} </span>}
                {index === Constants.SUPPORTED_BROWSERS.length - 1 && <span>.</span>}
      </span>
        });
    }

    render() {
        return (
            <Card variant='info' className="login-panel">
                <Card.Header className="text-light bg-primary" as="h6">{this.i18n('login.title')}</Card.Header>
                <Card.Body>
                    {!this.state.deviceSupported &&
                    <div className='message-container'>
                        <Alert className={`alert-browser-support`} variant="warning">
                            {this.i18n('Your browser is not fully supported! Some parts of web may not work properly.')}<br/>
                            {this.i18n('We recommend using the latest version of ')}
                            {this.getSupportedBrowsersLinks()}
                        </Alert>
                    </div>}
                    {this.state.showAlert && this.props.error &&
                    <div>
                        <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={'top'}
                                      message={this.i18n('login.error')}/>

                    </div>}
                    <Form>
                        <HorizontalInput type='text' name='username' ref={(input) => {
                            this.usernameField = input;
                        }}
                                         label={this.i18n('login.username')} value={this.state.username}
                                         onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                                         inputWidth={9}/>
                        <HorizontalInput type='password' name='password' label={this.i18n('login.password')}
                                         value={this.state.password}
                                         onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                                         inputWidth={9}/>
                        <div className="login-forgot-password-block">
                            <Button variant='link' className='login-forgot-password' size='sm'
                                    onClick={this.onForgotPassword}>{this.i18n('login.forgot-password')}</Button>
                        </div>
                        <div>
                            <Button variant='success' size='block' onClick={this.login}
                                    disabled={this.props.isLogging}>
                                {this.i18n('login.submit')}{this.props.isLogging && <LoaderSmall/>}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(Login)));

function mapStateToProps(state) {
    return {
        isLogging: state.auth.isLogging,
        status: state.auth.status,
        error: state.auth.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
    }
}