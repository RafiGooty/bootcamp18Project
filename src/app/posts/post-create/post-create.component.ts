import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls: ['./post-create.component.css']

})
export class PostCreateComponent implements OnInit {
  enteredContent=""
  enteredTitle=""

  post:Post;
  mode:string='create';
  id:string="";
  ReactiveformGroup:FormGroup;
  fileData:File;
  filePreview:string;

  constructor(public postsService:PostsService,public route:ActivatedRoute){}

  ngOnInit(){

    this.ReactiveformGroup=new FormGroup({
      'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      'content':new FormControl(null,{validators:[Validators.required]}),
      'image': new FormControl(null)
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
    if (paramMap.has("postId")){
      console.log(paramMap.get("postId"));
      this.id   = paramMap.get("postId");
      this.mode = 'edit';
      this.postsService.editData(this.id)
      .subscribe(response=>
                  { this.post = response.post;
                    console.log(response);
                    this.ReactiveformGroup.setValue(
                                                      {   title:this.post.title,
                                                          content:this.post.content,
                                                          image:this.post.imageUrl
                                                      }
                                                    )
                  }
                 );

      console.log(this.post,"rafi")

    } else{
      this.mode = 'create';
      this.id   = null;
      console.log("create",this.mode);
    }
  })
  }

  onFileUpload(event:Event){
   this.fileData=(event.target as HTMLInputElement).files[0];
   this.ReactiveformGroup.patchValue({image:this.fileData})
   this.ReactiveformGroup.get('image').updateValueAndValidity;

    var reader=new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload=()=>{
    this.filePreview=reader.result as string;
    }
  }


  onAddPost(){
    if(this.ReactiveformGroup.invalid){
      return;
    }
    if(this.mode==='edit'){
      console.log(this.mode)
      this.postsService.editPost( this.id,
                                  this.ReactiveformGroup.value.title,
                                  this.ReactiveformGroup.value.content,
                                  this.ReactiveformGroup.value.image);
    } else{
      this.postsService.addPost(  this.id,
                                  this.ReactiveformGroup.value.title,
                                  this.ReactiveformGroup.value.content,
                                  this.ReactiveformGroup.value.image);
    }

  this.ReactiveformGroup.reset();

  }
}
