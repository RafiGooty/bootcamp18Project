import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpConfigInterceptor  implements HttpInterceptor{

  constructor(private authroization:AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler)
  { const token=this.authroization.getToken();
   const request= req.clone(
        {
          headers:req.headers.set('Authorization',"Bearer "+ token)
        }
      )
    return next.handle(request);
  }
}
