import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  uploadUrl = environment.domain+"/api/upload";
  searchText = "";
  user: any = {
    _id: '',
    username: '',
    password: '',
    enterpassword: ''
  }

  content: any = {
    username: '',
    content: '',
    image: '',
    date: ''
  }

  items: Array<any> = [];

  constructor(public http: HttpClient, private fb: FormBuilder, private message: NzMessageService) {

  }

  ngOnInit() {
    console.log('information Component ngOnInit')
    this.get();
  }

  get() {
    this.http.get(environment.domain + '/api/get', {}).subscribe((res: any) => {
      console.log(res.data);
      this.items = res.data;
      this.items.map(i => {
        if (i.image != null) {
          i.image = environment.domain + '/' + i.image;
        }
      })
    }, err => {
    });
  }


  login() {
    this.http.post(environment.domain + '/api/login', this.user).subscribe((res: any) => {
      console.log(res.data);
      if (res.data) {
        this.isLoginVisible = false;
        this.user = res.data;
      } else {
        this.message.create('warning', `username or password is invalid ! `);
      }
    }, err => {
    });
  }

  register() {

    if (this.user.password != this.user.enterpassword) {
      this.message.create('warning', 'Entered passwords differ');
      return;
    }

    this.http.post(environment.domain + '/api/register', this.user).subscribe((res: any) => {
      console.log(res.data);
      this.message.create('warning', res.message);
      if (res.data) {
        this.isRegisterVisible = false;
      }
    }, err => {
    });
  }


  isLoginVisible = false;
  showLoginModal(): void {
    this.isLoginVisible = true;
  }

  isRegisterVisible = false;
  showRegisterModal() {
    this.isRegisterVisible = true;
  }

  isPOSTVisible = false;
  showPOSTModal() {
    this.isPOSTVisible = true;
  }

  handleCancel(): void {
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
    this.isPOSTVisible = false;
  }


  loading = false;
  avatarUrl: string;
  beforeUpload = (file: File) => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   this.message.error('You can only upload JPG file!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }
  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {

      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });

      this.content.image = info.file.response.data;
    }
  }

  post() {
    this.content.username = this.user.username;
    this.content.date = new Date().getTime();
    this.http.post(environment.domain + '/api/post', this.content).subscribe((res: any) => {
      console.log(res.data);
      this.message.create('warning', res.message);
      if (res.data) {
        this.isPOSTVisible = false;
        this.content.content="";
        this.content.image="";
      }
      this.get();
    }, err => {
    });
  }

  del(item) {
    this.http.post(environment.domain + '/api/del', { _id: item._id }).subscribe((res: any) => {
      console.log(res.data);
      this.message.create('warning', res.message);
      this.get();
    }, err => {
    });
  }

  search() {
    this.http.get(environment.domain + '/api/search?content=' + this.searchText).subscribe((res: any) => {
      console.log(res.data);
      this.items = res.data;
      this.items.map(i => {
        if (i.image != null) {
          i.image = environment.domain + '/' + i.image;
        }
      })
    }, err => {
    });
  }
  logout() {
    this.user = {
      _id: '',
      username: '',
      password: '',
      enterpassword: ''
    }
  }

}
