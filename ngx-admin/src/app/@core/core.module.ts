import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthJWTToken, NbAuthModule, NbDummyAuthStrategy, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService, SeoService } from './utils';
import { UserData } from './data/users';
import { UserService } from './mock/users.service';
import { MockDataModule } from './mock/mock-data.module';

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: "email",
        token: {
          class: NbAuthJWTToken,
        },
        baseEndpoint: " http://localhost:8080/api/v1",

        login: {
          endpoint: "/user/tokenbybody",
          method: "post",
        },
        register: {
          endpoint: "/user/create",
          method: "post",
        },
        logout: {
          endpoint: "/user/logout",
          method: "post",
        },
        requestPass: {
          endpoint: "/password/forgotpassword",
          method: "post",
        },
        resetPass: {
          endpoint: "/password/changepassword",
          method: "post",
        },
      }),
    ],
    forms: {
      login: {
        redirectDelay: 500,
        strategy: "email",
        rememberMe: false,
        showMessages: {
          success: true,
          error: true,
        },
        redirect: {
          success: "/",
          failure: null,
        },
        // socialLinks: socialLinks,
      },
      register: {
        redirectDelay: 500,
        strategy: "email",
        showMessages: {
          success: true,
          error: true,
        },
        redirect: {
          success: "/",
          failure: null,
        },
        terms: true,
        // socialLinks: socialLinks,
      },
      requestPassword: {
        redirectDelay: 500,
        strategy: "email",
        showMessages: {
          success: true,
          error: true,
        },
        socialLinks: socialLinks,
      },
      resetPassword: {
        redirectDelay: 500,
        strategy: "email",
        showMessages: {
          success: true,
          error: true,
        },
        socialLinks: socialLinks,
      },
      logout: {
        redirectDelay: 500,
        strategy: "email",
      },
      validation: {
        password: {
          required: true,
          minLength: 8,
          maxLength: 50,
        },
        email: {
          required: true,
        },
        fullName: {
          required: false,
          minLength: 4,
          maxLength: 100,
        },
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: "*",
      },
      user: {
        parent: "guest",
        create: "*",
        edit: "*",
        remove: "*",
      },
    },
  }).providers,

  {
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  SeoService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
