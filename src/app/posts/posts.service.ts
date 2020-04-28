import { Injectable } from '@angular/core';
import {Post} from './post.model'
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
public posts:Post[]=[];
private postsUpdated= new Subject<Post[]>();

  constructor(private http:HttpClient,private router:Router) { }
  getPosts(){
      this.http.get<{message:string,posts:any}>('http://localhost:3000/apps/data')
      .pipe(map(rowData=>{return rowData.posts.map( postData=>
                              { return {  id      : postData._id,
                                          title   : postData.title,
                                          content : postData.content,
                                          imageUrl: postData.imageUrl,
                                          creator:  postData.creator
                                        }
                              })
                          }))
      .subscribe((data)=>{
        console.log(data,"get all");
           this.posts= data;
           this.postsUpdated.next(this.posts);
    });
  }

  getPostUpdateListtner(){
    return this.postsUpdated.asObservable();
  }

  addPost(  id      :string,
            title   :string,
            content :string,
            image   :File
          ){

    let post :Post={ id     :null,
                    title   :title,
                    content :content,
                    imageUrl:null,
                    creator:null
                  }
    let postFormData= new FormData();

    postFormData.append("title",title);
    postFormData.append("content",content);
    postFormData.append("image",image,title);

    this.http.post<{message:string,post:Post}>
    ("http://localhost:3000/apps/data",postFormData)
    .subscribe((responseData)=>
                                {
                                    post.id=responseData.post.id;
                                    post.imageUrl=responseData.post.imageUrl;
                                    this.posts.push(post);
                                    this.postsUpdated.next(this.posts);
                                    this.router.navigate(["/"]);
                                }
              )
  }

  editPost( id      :string,
            title   :string,
            content :string,
            image   :File|string
          ){
    let postFormData:Post|FormData;
    if(typeof(image)==="object"){
      postFormData=new FormData();
      postFormData.append('title',title);
      postFormData.append('content',content);
      postFormData.append('image',image,title);
    } else {
              postFormData ={
                              id:id,
                              title:title,
                              content:content,
                              imageUrl:image,
                              creator:null
                            }
            }
    let post :any={id:id,title:title,content:content}
    this.http.put<{message:string,id:string}>
    ("http://localhost:3000/apps/data/" +id,postFormData)
    .subscribe(responseData=>{
      //const post=this.posts this.posts.findIndex(val=>val['id']===responseData.id);
      console.log("update Scusscfull");
      this.router.navigate(["/"]);
    })
  }


  editData(postId:string)
  {
   // return {...this.posts.find(post=>post.id===postId)};
   return this.http.get<{message:string,post:Post}>
   ("http://localhost:3000/apps/data/" +postId)
  }

  deletePost(postID:string){
    this.http.delete("http://localhost:3000/apps/data/" + postID)
    .subscribe(()=>{
      console.log("hellow")
     const updateDeleted=this.posts.filter(post=> post.id !=postID);
      this.posts=updateDeleted;
      this.postsUpdated.next(this.posts);
    })
  }
}
