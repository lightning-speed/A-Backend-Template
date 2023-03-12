

class View{
    constructor(type){
        this.component = document.createElement(type==null ? 'div' : type);
        this.children = [];
    }
    add(view){
        this.component.appendChild(view.component);
        this.children.push(view);
        view.parent = this;
        return this;
    }
    remove(view){
        const index = this.children.indexOf(view);
        if(this.children[index].ending == false)
        this.children[index].end();
        this.children.splice(index,1);
    }
    end(){
        this.ending=true;
        this.component.remove();
        this.endChildren();
        this.parent.remove(this);
    }
    endChildren(){
        this.children.forEach((child)=>{
            child.ending=true;
        child.component.remove();
        child.endChildren();
        })
    }
    setClass(classes){
        this.component.className = classes;
        return this;
    }
    setStyle(style){
        for(var prop in style)
        this.component.style[prop] = style[prop];
        return this;
    }
    set(edits){
        for(var prop in edits)
        this.component[prop] = edits[prop];
        return this;
    }
}

const Root = new View()
Root.component = document.getElementById('root');

class AppCompactView extends View{
    constructor(){
        super();
        this.setStyle({
            width:"100%",
            height:"100%",
            backgroundColor:"rgba(240,240,245)"
        })
        this.start();
        
    }
}

class Navigator{
    constructor(){
        this.AppViews = [];
    }
    openView(view){
        this.AppViews.push(view);
        Root.add(view);
    }
}