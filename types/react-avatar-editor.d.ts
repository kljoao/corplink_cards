declare module 'react-avatar-editor' {
  import React from 'react'

  export interface AvatarEditorProps {
    image?: string | File
    width?: number
    height?: number
    border?: number | number[]
    borderRadius?: number
    color?: number[]
    backgroundColor?: string
    style?: React.CSSProperties
    scale?: number
    position?: { x: number; y: number }
    rotate?: number
    crossOrigin?: string
    className?: string | string[]
    onLoadFailure?: (event: any) => void
    onLoadSuccess?: (imgInfo: any) => void
    onImageReady?: (event: any) => void
    onMouseUp?: () => void
    onMouseMove?: (event: any) => void
    onImageChange?: () => void
    onPositionChange?: (position: { x: number; y: number }) => void
    disableBoundaryChecks?: boolean
    disableHiDPIScaling?: boolean
  }

  export interface AvatarEditorRef {
    getImage(): HTMLCanvasElement
    getImageScaledToCanvas(): HTMLCanvasElement
    getCroppingRect(): { x: number; y: number; width: number; height: number }
  }

  const AvatarEditor: React.ForwardRefExoticComponent<
    AvatarEditorProps & React.RefAttributes<AvatarEditorRef>
  >

  export default AvatarEditor
} 