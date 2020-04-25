import { performAction } from './js/app'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/form.scss'
import './styles/footer.scss'

export {
    performAction
}

  /* Add event listener to generate new entry */
  document.getElementById('form').addEventListener('submit', performAction);