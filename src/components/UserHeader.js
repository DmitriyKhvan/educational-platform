import { getAvatarName } from '../constants/global'
import Stars from './Stars'
import { Avatar } from './Avatar'

export const UserHeader = ({ user, roleUser, onAction }) => {
  return (
    <div className="user-header">
      <div className="user-info">
        <Avatar
          avatar={user.avatar}
          name={getAvatarName(user.first_name, user.last_name)}
        />
        <div className="info">
          <p className="name">{`${user.first_name} ${user.last_name}`}</p>
          {user.tutor_profile && <Stars points={3.5} />}
          <p className="address">State of Wisconsin, US</p>
        </div>
        {user.student && (
          <div className="contact">
            {user.student.user.phone_number && (
              <p>{user.student.user.phone_number}</p>
            )}
            <p>{user.student.user.email}</p>
          </div>
        )}
      </div>
      <div className="btn-go-profile" onClick={onAction}>
        Go To Profile
      </div>
    </div>
  )
}
