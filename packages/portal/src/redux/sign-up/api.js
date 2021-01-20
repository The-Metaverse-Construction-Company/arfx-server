import Http from 'axios'
import { SERVER_HOST } from '../../utils/constants'
export const signInAccount = ({data}) => {
	return Http({
		method: 'POST',
		url: `${SERVER_HOST}/api/auth/sing-up`,
		data,
	}).then(resp => {
		return resp.data
	})
}