const byDistrict = "byDistrict";
const byUserId = "byUserId";

export default function Component({
  navigation
}: any) {
  // some code here

  // @ts-expect-error TS(2304): Cannot find name 'useEffect'.
  useEffect(() => {
    // @ts-expect-error TS(2304): Cannot find name 'switched'.
    if (switched) {
      // @ts-expect-error TS(2552): Cannot find name 'realm'. Did you mean 'Realm'?
      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.removeByName(byUserId);
        mutableSubs.add(
          // @ts-expect-error TS(2552): Cannot find name 'realm'. Did you mean 'Realm'?
          realm
            .objects("Farmer")
            // @ts-expect-error TS(2304): Cannot find name 'user'.
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: byDistrict },
        );
      });
    } else {
      // @ts-expect-error TS(2552): Cannot find name 'realm'. Did you mean 'Realm'?
      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.removeByName(byDistrict);
        mutableSubs.add(
          // @ts-expect-error TS(2552): Cannot find name 'realm'. Did you mean 'Realm'?
          realm
            .objects("Farmer")
            // @ts-expect-error TS(2304): Cannot find name 'user'.
            .filtered(`userId == "${user?.customData?.userId}"`),
          { name: byUserId },
        );
      });
    }
  // @ts-expect-error TS(2304): Cannot find name 'switched'.
  }, [switched, realm]);
  // some code there
}
