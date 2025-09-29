import UserController from './UserController'
import QuizController from './QuizController'
import Settings from './Settings'
import Auth from './Auth'
const Controllers = {
    UserController: Object.assign(UserController, UserController),
QuizController: Object.assign(QuizController, QuizController),
Settings: Object.assign(Settings, Settings),
Auth: Object.assign(Auth, Auth),
}

export default Controllers