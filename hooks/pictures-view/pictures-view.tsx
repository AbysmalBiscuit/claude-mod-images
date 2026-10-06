import type { Elements, RenderNode } from 'claude-code'

import { type Cells, cellsOf } from '../cells-of'
import type { Drawable } from '../drawable-of'
import { INDENT_COLUMNS } from '../limits'

/**
 * One picture to draw: its call's id, what it decoded to, the file's name,
 * whether the person hid it and what pressing its caption does.
 */
export type Shown = {
  id: string
  drawable: Drawable
  name: string
  isHidden: boolean
  onToggle: () => void
}

/**
 * The pictures in a row under a transcript row, wrapping at its width: each
 * an Image over a caption that hides and shows it (`▾` shown, `▸` hidden),
 * or a dim line saying why it is not drawn.
 *
 * @param ui the terminal's elements, from `$.ui.resolve(e)`
 * @param pictures the pictures, in the order their calls ran
 * @param room the most cells each picture's image may take (`roomOf`)
 * @returns the drawing to place under the row
 */
export const picturesView = (
  ui: Pick<Elements['terminal'], 'Box' | 'Button' | 'Text' | 'Image'>,
  pictures: ReadonlyArray<Shown>,
  room: Cells,
): RenderNode => {
  const { Box, Button, Text, Image } = ui

  return (
    <Box flexDirection="row" flexWrap="wrap" columnGap={1} paddingLeft={INDENT_COLUMNS}>
      {pictures.map(({ id, drawable, name, isHidden, onToggle }) => {
        if ('reason' in drawable) {
          return <Text dimColor>{`${name} not drawn: ${drawable.reason}`}</Text>
        }

        const caption = `${name} · ${drawable.width}×${drawable.height}`
        const cells = cellsOf(drawable.width, drawable.height, room)

        return (
          <Box flexDirection="column">
            {isHidden ? null : <Image source={drawable.source} {...cells} alt={caption} />}
            <Button key={id} plain dimColor label={`${isHidden ? '▸' : '▾'} ${caption}`} onPress={onToggle} />
          </Box>
        )
      })}
    </Box>
  )
}
