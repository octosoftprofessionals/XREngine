import { CameraModes } from '../../camera/types/CameraModes'
import EditorNodeMixin from './EditorNodeMixin'
import { Object3D } from 'three'

/**
 * @author Hamza Musthaq <hamzamushtaq34@hotmail.com>
 */
export default class CameraPropertiesNode extends EditorNodeMixin(Object3D) {
  static nodeName = 'Camera Properties'
  static legacyComponentName = 'cameraproperties'
  static disableTransform = true
  static ignoreRaycast = true
  static haveStaticTags = false
  static cameraModeChangedCallback: (node, isRemoved?) => void

  constructor(editor) {
    super(editor)
    this.cameraOptions = {
      CameraType: {
        CameraMode: CameraModes.ThirdPerson
      }
    }
    //CameraPropertiesNode.cameraModeChangedCallback(this)
  }

  getPropertyValue = (arr: []): any => {
    if (arr.length < 1) return null
    let value = this.cameraOptions
    arr.forEach((element) => {
      if (value[element] === '') return null
      value = value[element]
    })
    return value
  }

  static canAddNode(editor) {
    return editor.scene.findNodeByType(CameraPropertiesNode) === null
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json)
    const cameraOptions = json.components.find((c) => c.name === this.legacyComponentName)
    const { options } = cameraOptions.props
    node.cameraOptions = options
    return node
  }

  onRendererChanged() {
    //CameraPropertiesNode.cameraModeChangedCallback(this)
  }

  serialize(projectID) {
    let data: any = {}
    data = {
      options: this.cameraOptions
    }
    return super.serialize(projectID, { cameraproperties: data })
  }

  onChange() {
    //CameraPropertiesNode.cameraModeChangedCallback(this)
  }

  onRemove() {
    //CameraPropertiesNode.cameraModeChangedCallback(this, true)
  }

  prepareForExport() {
    super.prepareForExport()
    this.addGLTFComponent('cameraOptions', {
      options: this.cameraOptions
    })
    this.replaceObject()
  }
}
