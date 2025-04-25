import { createBrowserRouter } from "react-router-dom";

import { Home } from "./Page/Home";
import { Detail } from "./Page/detail";
import { Layout } from "./components/layout";
import { Error } from "./Page/NotFound";

const router = createBrowserRouter([
   {
    element: <Layout/>,
    children: [
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/detail/:cripto',
            element: <Detail/>
        },
        {
            path: '*',
            element: <Error/>
        }
    ]
   }
])

export { router };

