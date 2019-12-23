//import jsonp from '../common/js/jsonp'
import { commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = '/api/'
  const data = commonParams
  
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })

}
