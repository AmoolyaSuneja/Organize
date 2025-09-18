import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'

export async function exportNodeAsPng(node: HTMLElement, fileName = 'design.png') {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#ffffff',
    filter: (el) => {
      const hidden = (el as HTMLElement).dataset?.noexport === 'true'
      return !hidden
    },
  })
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  saveAs(blob, fileName)
}

export async function shareImage(blob: Blob, title = 'Room Organizer Design') {
  if ((navigator as any).share && (navigator as any).canShare?.({ files: [new File([blob], 'design.png', { type: 'image/png' })] })) {
    const file = new File([blob], 'design.png', { type: 'image/png' })
    await (navigator as any).share({ title, files: [file] })
    return true
  }
  return false
}

export async function exportNodeToBlob(node: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#ffffff',
    filter: (el) => {
      const hidden = (el as HTMLElement).dataset?.noexport === 'true'
      return !hidden
    },
  })
  const res = await fetch(dataUrl)
  return await res.blob()
}


