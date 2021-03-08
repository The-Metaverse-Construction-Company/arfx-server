import http from 'axios'
import FormData from 'form-data'
import querystring from 'querystring'
import { 
  IMSGraphAPIGateway,
  IMSGraphCreateAdminUser
 } from '../../api/domain/interfaces'

class MSGraph implements IMSGraphAPIGateway {
  public accessToken: string = ''
  constructor (
      private readonly tenantName: string,
      private readonly clientId: string,
      private readonly clientSecret: string
  ) {}
  /**
   * @public
   *  - create admin account directly on the ms graph api
   * @param adminData 
   */
  public createAdminAccount = async (adminData: IMSGraphCreateAdminUser):Promise<any>  => {
    try {
      // generate accessToken first,
      await this.generateAccessToken()
      // const body = querystring.stringify({
      //   "client_id": this.clientId,
      //   "client_secret": this.clientSecret,
      //   "grant_type": "client_credentials",
      //   "scope": `https://graph.microsoft.com/.default`,
      // })
      // console.log('this.accessToken :>> ', this.accessToken);
      const {data} = await http({
        url: `https://graph.microsoft.com/v1.0/users`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        data: {
          "accountEnabled": true,
          "displayName": adminData.fullName,
          "mailNickname": "Admin",
          "userPrincipalName": `${adminData.username}@${this.tenantName}.onmicrosoft.com`,
          "passwordProfile" : {
              "forceChangePasswordNextSignIn": true,
              "password": "admin123!@#"
          }
        }
      })
      return data
    } catch (error) {
      console.log('error.message :>> ', error.response);
      // throw error
    }
  }
  /**
   * @public
   *  - generate access token to request directly on the ms graph api
   */
  public generateAccessToken = async () => {
    try {
      const body = querystring.stringify({
        "client_id": this.clientId,
        "client_secret": this.clientSecret,
        "grant_type": "client_credentials",
        "scope": `https://graph.microsoft.com/.default`,
      })
      const {data} = await http({
        url: `https://login.microsoftonline.com/arfxhomedev.onmicrosoft.com/oauth2/v2.0/token`,
        method: "POST",
        data: body,
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      throw error
    }
  }
  // public async getUserList () {
  //   try {
  //     const {data} = await http({
  //       url: `https://graph.microsoft.com/v1.0/users`,
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${this.accessToken}`
  //       }
  //     })
  //     return data
  //   } catch (error) {
  //     throw error
  //   }
  // }
}

export default MSGraph