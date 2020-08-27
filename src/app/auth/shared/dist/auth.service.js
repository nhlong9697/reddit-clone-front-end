"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AuthService = /** @class */ (function () {
    function AuthService(httpClient, localStorage) {
        this.httpClient = httpClient;
        this.localStorage = localStorage;
        this.loggedIn = new core_1.EventEmitter();
        this.username = new core_1.EventEmitter();
        this.refreshTokenPayload = {
            refreshToken: this.getRefreshToken(),
            username: this.getUserName()
        };
    }
    AuthService.prototype.signup = function (signupRequestPayload) {
        return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, { responseType: 'text' });
    };
    AuthService.prototype.login = function (loginRequestPayload) {
        var _this = this;
        return this.httpClient
            .post('http://localhost:8080/api/auth/login', loginRequestPayload)
            .pipe(operators_1.map(function (data) {
            _this.localStorage.store('authenticationToken', data.authenticationToken);
            _this.localStorage.store('username', data.username);
            _this.localStorage.store('refreshToken', data.refreshToken);
            _this.localStorage.store('expiresAt', data.expiresAt);
            _this.loggedIn.emit(true);
            _this.username.emit(data.username);
            return true;
        }));
    };
    AuthService.prototype.getJwtToken = function () {
        return this.localStorage.retrieve('authenticationToken');
    };
    AuthService.prototype.refreshToken = function () {
        var _this = this;
        console.log('refresh token is called');
        console.log(this.refreshTokenPayload);
        return this.httpClient
            .post('http://localhost:8080/api/auth/refresh/token', this.refreshTokenPayload)
            .pipe(operators_1.tap(function (response) {
            console.log('this is the response');
            console.log(response);
            _this.localStorage.clear('authenticationToken');
            _this.localStorage.clear('expiresAt');
            _this.localStorage.store('authenticationToken', response.authenticationToken);
            _this.localStorage.store('expiresAt', response.expiresAt);
        }));
    };
    AuthService.prototype.logout = function () {
        this.httpClient
            .post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload, {
            responseType: 'text'
        })
            .subscribe(function (data) {
            console.log(data);
        }, function (error) {
            rxjs_1.throwError(error);
        });
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('username');
        this.localStorage.clear('refreshToken');
        this.localStorage.clear('expiresAt');
    };
    AuthService.prototype.getUserName = function () {
        return this.localStorage.retrieve('username');
    };
    AuthService.prototype.getRefreshToken = function () {
        return this.localStorage.retrieve('refreshToken');
    };
    AuthService.prototype.isLoggedIn = function () {
        return this.getJwtToken() != null;
    };
    __decorate([
        core_1.Output()
    ], AuthService.prototype, "loggedIn");
    __decorate([
        core_1.Output()
    ], AuthService.prototype, "username");
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
