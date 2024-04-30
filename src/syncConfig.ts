/* eslint-disable prettier/prettier */

import { realm } from "./screens/HomeScreen/HomeScreen";
import { Realm, useApp } from "@realm/react";

// @ts-expect-error TS(7006): Parameter 'isManualResetConfirmed' implicitly has ... Remove this comment to see the full error message
export const syncConfig = (isManualResetConfirmed, onSyncError) => ({
    flexible: true,

    existingRealmFileBehavior: {
        type: "openImmediately",
        timeOut: 1000,
        timeOutBehavior: "openLocalRealm",
    },

    clientReset: {
        mode: "recoverUnsyncedChanges",
        onBefore: (realm: any) => {
            // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
            console.log("Beginning the client reset for", realm.path);
        },
        onAfter: (beforeRealm: any, afterRealm: any) => {
            // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
            console.log("Finished the client reset for", beforeRealm.path);
            // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
            console.log("New realm path", afterRealm.path);
        },
        onFallback: (_session: any, path: any) => {
            try {
                // Prompt user to perform a client reset immediately. If they don't,
                // they won't receive any data from the server until they restart the app
                // and all changes they make will be discarded when the app restarts.

                if (isManualResetConfirmed) {
                    // Close and delete old realm from device
                    realm.close();
                    Realm.deleteFile(path);
                    // Perform client reset
                    const app = useApp();
                    Realm.App.Sync.initiateClientReset(app, path);
                    // Navigate the user back to the main page or reopen the
                    // the Realm and reinitialize the current page
                }
            } catch (error) {
                // Reset failed. Notify user that they'll need to
                // update the app
                // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
                console.log("Client Reset Error =>", { cause: error });
            }
        },
    },

    onError: (_: any, error: any) => {
        onSyncError(error);
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("Sync Error =>", error);
    }
});
