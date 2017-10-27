function getRandom(min, max) {
    return Math.floor(Math.random() * (min - max)) + max;
}
var DungeonNode = function(x,y,w,h,p){
  this.left= null;
  this.right= null;
  this.parent=p;
  this.x=x;
  this.y=y;
  this.width=w;
  this.height=h;
  this.Room = function(roomX , roomY , roomW,roomH){
    this.roomX =roomX ;
    this.roomY = roomY;
    this.roomW =roomW;
    this.roomH=roomH;
	this.hall = function(hallX , hallY , hallW , hallH){
		this.hallX = hallX;
		this.hallY = hallY;
		this.hallW = hallW;
		this.hallH = hallH;
	}
  }
}
var DungeonBSP = function(w,h,min, max){
    this.root=new DungeonNode(0,0,w,h,null);
    this.minLeafSize = min;
    this.maxLeafSize = max;
    this.nodes =[];
    this.rooms =[];
    this.halls=[];
  //  this.board = Array(w).fill(Array(h).fill(0));
}

DungeonBSP.prototype.split = function(node){
  if(node.left!=null&&node.right!=null)return false;
  var orienation = Math.random()<0.5?true:false;
  if(node.width > node.height && node.width / node.height >=1.25){
    orienation = true;
  }else if(node.height > node.width && node.height/node.width>=1.25){
    orienation = false;
  }
  var max = (orienation? node.width : node.height)-this.minLeafSize;
  if(max < this.minLeafSize) return fasle;
  var splitLocation = getRandom(this.minLeafSize,max);
  if(orienation){
    node.left = new DungeonNode(node.x,node.y,splitLocation,node.height,node);
    node.right = new DungeonNode(node.x+splitLocation,node.y,node.width-splitLocation,node.height,node);
  }else{
    node.left = new DungeonNode(node.x , node.y , node.width , splitLocation);
    node.right = new DungeonNode(node.x, node.y+splitLocation,node.width, node.height-splitLocation);
  }
  return true;
}

DungeonBSP.prototype.partition= function(){
  this.nodes.push(this.root);
  
  var do_split = true; 
  while (do_split) {
    do_split= false;
    for(var i =0 ; i<this.nodes.length;i++){
      var tmp = this.nodes[i]; 
      if(tmp.left==null&&tmp.right==null){
        if(tmp.width > this.maxLeafSize || tmp.height > this.maxLeafSize){
          if(this.split(tmp)){
            this.nodes.push(tmp.left);
            this.nodes.push(tmp.right);
            do_split=true;
          }
        }
      }
    }
  }
  
}
var a = 0;
DungeonBSP.prototype.createRooms=function(node,ctx){
  if(node.left==null&&node.right==null){
    var w = getRandom(this.minLeafSize/2,node.width-2);
    var h = getRandom(this.minLeafSize/2,node.height-2);
    var x = getRandom(node.x+1,node.x-2+node.width-w-1);
    var y = getRandom(node.y+1,node.y-2+node.height-h-1);
   
	 node.room = new node.Room(x,y,w,h);
     this.rooms.push(node.room);
     ctx.fillRect(x,y,w,h); 
	 
	  }
}
DungeonBSP.prototype.createHallways = function(ctx){
	 for(var i =1 ; i<this.rooms.length;i++){
    	var tmpP = this.rooms[i-1];
    	var tmpC = this.rooms[i];
	 	this.createHalls(tmpP,tmpC);
	 }
	for(var i = 0; i < this.halls.length; i++){
	var tmp = this.halls[i];
    
		ctx.fillRect(tmp.hallX,tmp.hallY,tmp.hallW,tmp.hallH); 
			 
	 }
		 
}
	
DungeonBSP.prototype.createHalls = function(left,right){
   var size = 6;
   var x1 = (getRandom(left.roomX+1,left.roomX+left.roomW));
   var x2 = (getRandom(right.roomX+1,right.roomX+right.roomW));
   var y1 = (getRandom(left.roomY+1,left.roomY+left.roomH));
   var y2 = (getRandom(right.roomY+1,right.roomY+right.roomH));
   var w = x2-x1;
   var h = y2-y1;
   if(w<0){
      if(h<0){
         if(Math.random()<0.5){
            this.halls.push(new left.hall(x2,y1,Math.abs(w),size));
            this.halls.push(new left.hall(x2,y2,size,Math.abs(h)));
           
         }else{
            this.halls.push(new left.hall(x2,y2,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x1,y2,size,Math.abs(h)));
         }
      }else if(h>0){
        if(Math.random()<0.5){
            this.halls.push(new left.hall(x2,y1,Math.abs(w),size));
            this.halls.push(new left.hall(x2,y1,size,Math.abs(h)));
         }else{
            this.halls.push(new left.hall(x2,y2,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x1,y1,size,Math.abs(h)));
         }
      }else if (w==0){
       this.halls.push(new left.hall(x2,y2,Math.abs(w)+size,size));
      }
   }else if(w>0){
     if(h<0){
       if(Math.random()<0.5){
            this.halls.push(new left.hall(x1,y2,Math.abs(w),size));
            this.halls.push(new left.hall(x1,y2,size,Math.abs(h)));
         }else{
            this.halls.push(new left.hall(x1,y1,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x2,y2,size,Math.abs(h)));
         }
     }else if(h>0){
       if(Math.random()<0.5){
            this.halls.push(new left.hall(x1,y1,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x2,y1,size,Math.abs(h))); 
         }else{
            this.halls.push(new left.hall(x1,y2,Math.abs(w),size));
            this.halls.push(new left.hall(x1,y1,size,Math.abs(h)));
         }
     }else if(h==0){
       this.halls.push(new left.hall(x1,y1,Math.abs(w)+size,size));
     }
   }else if(w==0){
    if(h<0){
      this.halls.push(new left.hall(x2,y2,size,Math.abs(h)));
    }else if(h>0){
      this.halls.push(new left.hall(x1,y1,size,Math.abs(h)));
    }
     
   }
 }

DungeonBSP.prototype.render= function(ctx){
  for(var i =0 ; i<this.nodes.length;i++){
    var tmp = this.nodes[i];
     if(tmp.left==null&&tmp.right==null){
      
       this.createRooms(tmp,ctx);
		
	 }
  } 
	 this.createHallways(ctx);
  }


var d = new DungeonBSP(600,400,100,300);
d.partition();
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = 'rgb(200, 20, 50)';
d.render(ctx);

