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
  this.Room = function(X , Y , W,H){
    this.X =X ;
    this.Y = Y;
    this.W =W;
    this.H=H;
	this.hall = function(X , Y , W , H){
		this.X = X;
		this.Y = Y;
		this.W = W;
		this.H = H;
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
    this.width=w;
    this.height=h;
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
  if(max < this.minLeafSize) return false;
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
DungeonBSP.prototype.createRooms=function(node){
  if(node.left==null&&node.right==null){
    var w = getRandom(this.minLeafSize/2,node.width-2);
    var h = getRandom(this.minLeafSize/2,node.height-2);
    var x = getRandom(node.x+1,node.x-2+node.width-w-1);
    var y = getRandom(node.y+1,node.y-2+node.height-h-1);

	 node.room = new node.Room(x,y,w,h);
     this.rooms.push(node.room);


	  }
}
DungeonBSP.prototype.createWays = function(ctx){
  this.createHalls(this.rooms[0],this.rooms[this.rooms.length-1]);
  this.createHalls(this.rooms[0],this.rooms[this.rooms.length-2]);
	 for(var i =1 ; i<this.rooms.length;i++){
    	var tmpP = this.rooms[i-1];
    	var tmpC = this.rooms[i];
	 	this.createHalls(tmpP,tmpC);
	 }


}

DungeonBSP.prototype.createHalls = function(left,right){
   var size = 2;
   var x1 = (getRandom(left.X+1,left.X+left.W));
   var x2 = (getRandom(right.X+1,right.X+right.W));
   var y1 = (getRandom(left.Y+1,left.Y+left.H));
   var y2 = (getRandom(right.Y+1,right.Y+right.H));
   var w = x2-x1;
   var h = y2-y1;
   if(w<0){
      if(h<0){
         if(Math.random()<0.5){

            this.halls.push(new left.hall(x2,y1,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x2,y2,size,Math.abs(h)));

         }else{
            this.halls.push(new left.hall(x2,y2,Math.abs(w)+size,size));
            this.halls.push(new left.hall(x1,y2,size,Math.abs(h)));
         }
      }else if(h>0){
        if(Math.random()<0.5){
            this.halls.push(new left.hall(x2,y1,Math.abs(w)+size,size));
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
            this.halls.push(new left.hall(x1,y2,Math.abs(w)+size,size));
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
            this.halls.push(new left.hall(x1,y2,Math.abs(w)+size,size));
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

DungeonBSP.prototype.render= function(){
  for(var i =0 ; i<this.nodes.length;i++){
    var tmp = this.nodes[i];
     if(tmp.left==null&&tmp.right==null){

       this.createRooms(tmp);

	 }
  }
	 this.createWays();
  }


var map ;
 var init = function(w,h,min,max){
   map = new DungeonBSP(w,h,min,max);
   map.partition();
   map.render();

 }
var getRooms= function(){
  return map.rooms;
}
var getHalls= function(){
  return map.halls;
}

 export default {init ,getRooms,getHalls };
