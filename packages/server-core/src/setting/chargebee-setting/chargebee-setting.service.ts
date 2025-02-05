import { Application } from '../../../declarations'
import { updateAppConfig } from '../../updateAppConfig'
import { ChargebeeSetting } from './chargebee-setting.class'
import hooks from './chargebee-setting.hooks'
import createModel from './chargebee-setting.model'

declare module '@etherealengine/common/declarations' {
  interface ServiceTypes {
    'chargebee-setting': ChargebeeSetting
  }
}

export default (app: Application): void => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new ChargebeeSetting(options, app)
  app.use('chargebee-setting', event)
  const service = app.service('chargebee-setting')
  service.hooks(hooks)

  service.on('patched', () => {
    updateAppConfig()
  })
}
