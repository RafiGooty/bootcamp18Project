import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent
  ],
  imports:[
    AngularMaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    CommonModule
  ]
})
export class PostsModule{}
