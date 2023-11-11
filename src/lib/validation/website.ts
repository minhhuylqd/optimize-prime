import z from "zod"

export const createWebsiteSchema = z.object({
    title: z.string().optional(),
    url: z.string().min(1, { message: "URL is required" }),
})

export type CreateWebsiteSchema = z.infer<typeof createWebsiteSchema>

export const updateWebsiteSchema = createWebsiteSchema.extend({
    id: z.string().min(1),
})

export const deleteWebsiteSchema = z.object({
    id: z.string().min(1),
})