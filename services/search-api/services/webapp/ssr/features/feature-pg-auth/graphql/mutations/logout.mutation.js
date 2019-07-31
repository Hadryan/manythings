import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { logout } from '../../auth.lib'

export const logoutMutation = () => ({
    description: 'Clean the authentication information from the running session',
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'AuthLogoutResult',
        fields: {
            token: {
                type: GraphQLString,
            },
        },
    })),
    resolve: (_, args, { req, res }) => logout({}, req, res),
})
