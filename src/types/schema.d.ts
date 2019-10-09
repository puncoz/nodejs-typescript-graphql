// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    query: string | null;
    logout: string | null;
    me: IUser | null;
    hello: string;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
  }

  interface IMutation {
    __typename: 'Mutation';
    login: Array<IError> | null;
    logout: boolean | null;
    register: Array<IError> | null;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    password: string;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }
}

// tslint:enable
