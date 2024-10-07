import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { RxAvatar } from "react-icons/rx";
import { companyAdmins } from "../../services/UserService/UserService";
import toastr from "toastr";
export const ParticipantInvite = ({
  participants,
  setParticipants,
  edit,
  onSubmit,
}) => {
  const [adminUser, setAdminUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);
  useEffect(() => {
    const fetchAdminUsers = async () => {
      const res = await companyAdmins();
      if (res?.status) {
        const formattedData = res?.data?.map((el) => ({
          name: `${el?.firstName}`,
          userId: el?.id,
          roleInMeeting: "Admin",
          email: el?.email,
        }));
        setAdminUsers(formattedData);
      } else {
        toastr.error(res?.message);
      }
    };

    fetchAdminUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = adminUser?.filter(
        (guest) =>
          guest?.name?.toLowerCase()?.includes(term?.toLowerCase()) ||
          guest?.email?.toLowerCase()?.includes(term?.toLowerCase())
      );
      setFilteredGuests(filtered);
    } else {
      setFilteredGuests([]);
    }
  };

  const addGuest = (guest) => {
    if (!participants?.some((g) => g.email === guest.email)) {
      setParticipants((prev) => [...prev, guest]);
    }
    setSearchTerm("");
    setFilteredGuests([]);
  };

  const removeGuest = (guestEmail) => {
    setParticipants(participants.filter((guest) => guest.email !== guestEmail));
  };
  const handleSave = (e) => {
    e.preventDefault();
    onSubmit(e, "Participants");
  };

  return (
    <>
      <div className="guest-list">
        <div className="input-section">
          <div className="input-div">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Add participants"
              className="form-control-SigninNew form-control guest-input"
            />
          </div>
          {filteredGuests?.length > 0 && (
            <div className="guest-suggestions">
              {filteredGuests?.map((guest) => (
                <div
                  key={guest?.email}
                  className="guest-item"
                  onClick={() => addGuest(guest)}
                >
                  <RxAvatar className="avatar" />
                  <span>
                    {guest?.name} ({guest?.email})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="added-guests">
          {participants?.map((guest) => (
            <div key={guest?.email} className="added-guest-item">
              <RxAvatar className="avatar" />
              <span>
                {guest?.name} ({guest?.email})
              </span>
              <button
                onClick={() => removeGuest(guest?.email)}
                variant="danger"
                className="closeIconBtn"
              ></button>
            </div>
          ))}
          {participants?.length === 0 && <p>No participant? added yet.</p>}
        </div>
      </div>
      <div className="companyDetailsBtmAction">
        {edit ? (
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        ) : (
          <> </>
        )}
      </div>
    </>
  );
};
