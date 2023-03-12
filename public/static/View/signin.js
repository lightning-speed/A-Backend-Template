class SigninView extends AppCompactView{
    start(){
        this.add(new View('button').set({
            innerHTML: "Enter",
        }))
    }
}