/** Wrapper functions for OpenPGP.js

    These functions just help tie OpenPGP.js to some jQuery stuff so
    they can affect the DOM.
*/

/** Load a public key from a URI. The file at the end of the URI
    should just be an ASCII armored key file. */
function loadPublicKey(keyURI) {
    var response, publicKey;

    // We need this to be an asynchronous call.
    jQuery.ajax({
        url: keyURI,
        success: function (data) {
            publicKey = openpgp.key.readArmored(data);
        },
        dataType: 'html',
        async: false
    });

    return publicKey;
}

/** Encrypt a textarea. Pass in the id of a textarea and an
    openpgp.key object, maybe loaded by loadPublicKey() above. */
function encryptTextarea(textareaId, publicKey) {
    var area = jQuery('#' + textareaId);
    var plaintext = area.val();
    var encrypted = area.attr('data-encrypted');

    if (encrypted) {
        alert("You've already encrypted this textarea.");
        return false;
    }

    var pgpMessage = openpgp.encryptMessage(publicKey.keys, plaintext);

    // This initial newline makes sure the encrypted text starts on its own line.
    area.val("\n" + pgpMessage);
    area.attr('data-encrypted', true);

    // If you don't want to make the textarea readonly after, comment this out.
    area.prop('readonly',true);

    return true;
}

// Testing/staging