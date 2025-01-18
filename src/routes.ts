import { Server } from "@hapi/hapi"
import { ValidationError } from "@hapi/joi"

import { ItemsService } from "./services/items.service"
import { createItemSchema, updateItemSchema } from "./schemas/item.schema"

export const defineRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return {
                ok: true
            }
        }
    })

    server.route({
        method: 'GET',
        path: '/items',
        handler: async (request, h) => {
            return await ItemsService.list()
        }
    })

    server.route({
        method: 'GET',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id)
            const item = await ItemsService.getById(id)

            if (!item) {
                return h.response().code(404)
            }

            return item
        }
    })

    server.route({
        method: 'POST',
        path: '/items',
        options: {
            validate: {
                payload: createItemSchema,
                failAction: async (request, h, err: ValidationError) => {
                    const error = err.details[0]
                    return h.response({
                        errors: [{
                            field: error.path[0],
                            message: error.message
                        }]
                    }).code(400).takeover()
                }
            }
        },
        handler: async (request, h) => {
            const item = await ItemsService.create(request.payload as any)
            return h.response(item).code(201)
        }
    })

    server.route({
        method: 'PUT',
        path: '/items/{id}',
        options: {
            validate: {
                payload: updateItemSchema,
                failAction: async (request, h, err: ValidationError) => {
                    const error = err.details[0]
                    return h.response({
                        errors: [{
                            field: error.path[0],
                            message: error.message
                        }]
                    }).code(400).takeover()
                }
            }
        },
        handler: async (request, h) => {
            const id = parseInt(request.params.id)
            const item = await ItemsService.update(id, request.payload as any)

            if (!item) {
                return h.response().code(404)
            }

            return item
        }
    })

    server.route({
        method: 'DELETE',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id)
            const deleted = await ItemsService.delete(id)

            return h.response().code(deleted ? 204 : 404)
        }
    })
}
