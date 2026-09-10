export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'list'

export interface PageBlock {
  id: string
  type: BlockType
  width: 4 | 6 | 8 | 12
  payload: Record<string, unknown>
}

export interface PageRow {
  id: string
  blocks: PageBlock[]
}
