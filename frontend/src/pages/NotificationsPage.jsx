import {
  useEffect
} from "react";

import {
  FiBell,
  FiCheck,
  FiTrash2
} from "react-icons/fi";

import {
  useAppDispatch,
  useAppSelector
} from "../store/hooks";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  selectNotifications,
  selectNotificationsStatus
} from "../features/notifications/notificationsSlice";

import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import { SectionLoader } from "../components/common/Spinner";
import { formatRelativeTime } from "../utils/formatters";

const NotificationsPage = () => {

  const dispatch = useAppDispatch();

  const notifications =
    useAppSelector(selectNotifications);

  const status =
    useAppSelector(selectNotificationsStatus);

  useEffect(() => {

    dispatch(fetchNotifications());

  }, [dispatch]);

  return (

    <div>

      <PageHeader

        title="Notifications"

        description="View all notification history."

      />

      <div className="mb-5">

        <button

          className="btn-outline"

          onClick={() =>
            dispatch(markAllNotificationsRead())
          }

        >

          Mark All Read

        </button>

      </div>

      {

        status === "loading"

          ?

          <SectionLoader />

          :

          notifications.length === 0

            ?

            <EmptyState

              icon={FiBell}

              title="No Notifications"

              description="You're all caught up."

            />

            :

            <div className="space-y-3">

              {

                notifications.map(notification => (

                  <div

                    key={notification._id}

                    className={`card p-4 flex justify-between items-start ${

                      !notification.read

                        ?

                        "border-primary-400"

                        :

                        ""

                    }`}

                  >

                    <div>

                      <h3 className="font-semibold">

                        {notification.title}

                      </h3>

                      <p className="text-sm text-slate-500">

                        {notification.message}

                      </p>

                      <p className="text-xs text-slate-400 mt-2">

                        {

                          formatRelativeTime(

                            notification.createdAt

                          )

                        }

                      </p>

                    </div>

                    <div className="flex gap-2">

                      {

                        !notification.read &&

                        <button

                          className="btn-outline btn-sm"

                          onClick={() =>

                            dispatch(

                              markNotificationRead(

                                notification._id

                              )

                            )

                          }

                        >

                          <FiCheck />

                        </button>

                      }

                      <button

                        className="btn-outline btn-sm"

                        onClick={() =>

                          dispatch(

                            deleteNotification(

                              notification._id

                            )

                          )

                        }

                      >

                        <FiTrash2 />

                      </button>

                    </div>

                  </div>

                ))

              }

            </div>

      }

    </div>

  );

};

export default NotificationsPage;