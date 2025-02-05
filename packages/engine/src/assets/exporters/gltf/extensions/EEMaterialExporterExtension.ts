import { CubeTexture, Material, Texture } from 'three'

import {
  extractDefaults,
  materialToDefaultArgs
} from '../../../../renderer/materials/functions/MaterialLibraryFunctions'
import { getMaterialLibrary } from '../../../../renderer/materials/MaterialLibrary'
import createReadableTexture from '../../../functions/createReadableTexture'
import { GLTFWriter } from '../GLTFExporter'
import { ExporterExtension } from './ExporterExtension'

export type EEMaterialExtensionType = {
  uuid: string
  name: string
  prototype: string
  args: { [field: string]: any }
}

export default class EEMaterialExporterExtension extends ExporterExtension {
  constructor(writer: GLTFWriter) {
    super(writer)
    this.name = 'EE_material'
    this.matCache = new Map()
  }

  matCache: Map<any, any>

  writeMaterial(material: Material, materialDef) {
    const argData = materialToDefaultArgs(material)
    if (!argData) return
    const result: any = {}
    Object.entries(argData).map(([k, v]) => {
      switch (v.type) {
        case 'texture':
          if (material[k]) {
            if (k === 'envMap') return //for skipping environment maps which cause errors
            if ((material[k] as CubeTexture).isCubeTexture) return //for skipping environment maps which cause errors
            let texture = material[k] as Texture
            const mapDef = { index: this.writer.processTexture(texture) }
            texture.repeat.y *= -1
            this.writer.applyTextureTransform(mapDef, texture)
            result[k] = mapDef
          } else result[k] = material[k]
          break
        default:
          result[k] = material[k]
          break
      }
    })
    delete materialDef.pbrMetallicRoughness
    delete materialDef.normalTexture
    delete materialDef.emissiveTexture
    delete materialDef.emissiveFactor
    materialDef.extensions = materialDef.extensions ?? {}
    materialDef.extensions[this.name] = {
      uuid: material.uuid,
      name: material.name,
      prototype:
        getMaterialLibrary().materials[material.uuid].value?.prototype ?? material.userData.type ?? material.type,
      args: result
    }
    this.writer.extensionsUsed[this.name] = true
  }
}
