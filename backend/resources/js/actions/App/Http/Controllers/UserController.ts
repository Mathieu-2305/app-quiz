import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
const index51602741bb19a7e9b158852b9bfa08a4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index51602741bb19a7e9b158852b9bfa08a4.url(options),
    method: 'get',
})

index51602741bb19a7e9b158852b9bfa08a4.definition = {
    methods: ["get","head"],
    url: '/api/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
index51602741bb19a7e9b158852b9bfa08a4.url = (options?: RouteQueryOptions) => {
    return index51602741bb19a7e9b158852b9bfa08a4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
index51602741bb19a7e9b158852b9bfa08a4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index51602741bb19a7e9b158852b9bfa08a4.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
index51602741bb19a7e9b158852b9bfa08a4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index51602741bb19a7e9b158852b9bfa08a4.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
    const index51602741bb19a7e9b158852b9bfa08a4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index51602741bb19a7e9b158852b9bfa08a4.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
        index51602741bb19a7e9b158852b9bfa08a4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index51602741bb19a7e9b158852b9bfa08a4.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/api/users'
 */
        index51602741bb19a7e9b158852b9bfa08a4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index51602741bb19a7e9b158852b9bfa08a4.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index51602741bb19a7e9b158852b9bfa08a4.form = index51602741bb19a7e9b158852b9bfa08a4Form
    /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
const index4f74708015d25e186d2d80ed42af2d9a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index4f74708015d25e186d2d80ed42af2d9a.url(options),
    method: 'get',
})

index4f74708015d25e186d2d80ed42af2d9a.definition = {
    methods: ["get","head"],
    url: '/user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
index4f74708015d25e186d2d80ed42af2d9a.url = (options?: RouteQueryOptions) => {
    return index4f74708015d25e186d2d80ed42af2d9a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
index4f74708015d25e186d2d80ed42af2d9a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index4f74708015d25e186d2d80ed42af2d9a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
index4f74708015d25e186d2d80ed42af2d9a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index4f74708015d25e186d2d80ed42af2d9a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
    const index4f74708015d25e186d2d80ed42af2d9aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index4f74708015d25e186d2d80ed42af2d9a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
        index4f74708015d25e186d2d80ed42af2d9aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index4f74708015d25e186d2d80ed42af2d9a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:12
 * @route '/user'
 */
        index4f74708015d25e186d2d80ed42af2d9aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index4f74708015d25e186d2d80ed42af2d9a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index4f74708015d25e186d2d80ed42af2d9a.form = index4f74708015d25e186d2d80ed42af2d9aForm

export const index = {
    '/api/users': index51602741bb19a7e9b158852b9bfa08a4,
    '/user': index4f74708015d25e186d2d80ed42af2d9a,
}

const UserController = { index }

export default UserController