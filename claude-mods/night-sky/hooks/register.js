const SCENE = 'night-sky'

export function register(on) {
  on('session.start', async ($, e, next) => {
    await $.theme.set({
      backdrop: { scene: SCENE },
      overrideColorScheme: 'dark',
    })
    await $.command.register({
      name: 'plain',
      description: 'Clear the night-sky backdrop',
    })
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.plugin !== $.plugin.name || e.props.scene !== SCENE) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    return Box({
      backgroundColor: 'black',
      flexDirection: 'column',
      children: [
        Text({ color: 'gray', dimColor: true, children: ['          ·                   ·          ·'] }),
        Text({ color: 'gray', dimColor: true, children: ['    ·                ·'] }),
        Text({ color: 'gray', dimColor: true, children: ['                          ·              ·'] }),
      ],
    })
  })

  on('command.run', { command: 'plain' }, async ($) => {
    const cleared = await $.theme.clear()
    return { text: cleared.reason }
  })
}
