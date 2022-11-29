import fastify from "fastify";
import S from 'fluent-json-schema'

const app = fastify({
    caseSensitive: false //case sensitivity routes
})

// decorators are utils that can be used to execute code without repeating any logic
// here you can put an object, a string, a value...
app.decorate('repeat', (string, times) => {
    return string.repeat(times)
})

app.addHook('onRequest', async (req, reply) => {
    // this is an example of the powerful lifecycle system of fastify
    // this will be executed before every request for EVERY route
    const res = app.repeat('repeat', 3)
    console.log(res)
})

app.route({
    method: 'POST',
    path: '/status',
    // this will be executed only on this particular route
    onRequest: async (req, reply) => {
        // another hook that execute code before body parsing
        console.log('hello world', req.body)
    },
    // fluent json schema validation
    schema: {
        body: S.object()
            .additionalProperties(false)
            // string() for example will be coerced automatically if number
            .prop('name', S.number().required()),
        response: {
            // tell to fastify the shape of the response object. 5x faster than normal serialization
            // if we know the response, it's better to have a schema for better performance

            // this schema return only the declared props, in this case "foo" will not be returned to the final response
            200: S.object().prop('status', S.string())
        }
    },
    handler: async (req, reply) => {
        return {
            status: 'ok',
            foo: 'bar'
        }
    }
})


app.listen({ port: 5099 }, err => {
    if (err) console.log(err)
    console.log(`Server running`)
})
