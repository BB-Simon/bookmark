import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'Hello I am from sign up' };
  }
  signin() {
    return { msg: 'Hello I am from sign in' };
  }
}
