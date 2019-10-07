import { generateNamespace } from "@gql2ts/from-schema"
import * as fs from "fs"
import { join } from "path"
import { stitchesSchema } from "../utils/stitchesSchema"

const generatedTypes = generateNamespace("GQL", stitchesSchema())
fs.writeFile(join(__dirname, "../types/schema.d.ts"), generatedTypes, error => {
    console.log(error)
})
