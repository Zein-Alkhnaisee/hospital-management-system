
import NavBar from "../NavBar/NavBar"
import FormSignUp from "../Form sign in/PrimaryForm/PrimaryForm"
import Test from './../Form sign in/Test'
import { useAuth } from "../AuthContext/AuthContext"

const Sign = () => {
  // const {isAuthenticated} = useAuth();
  return (
    <div >
        <div id="topContact"></div>
        {/* {isAuthenticated && <NavBar/> } */}
        {/* <FormSign/> */}
        {/* <Test /> */}
        <FormSignUp />

        
    </div>
  )
}

export default Sign