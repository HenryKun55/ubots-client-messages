import { z } from 'zod'

const schema = z.object({
  text: z.string().min(1),
})

export type FormDataInput = z.input<typeof schema>
export type FormDataOutput = z.output<typeof schema>

export default schema
