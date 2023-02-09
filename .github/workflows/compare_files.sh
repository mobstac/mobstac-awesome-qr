#!/bin/bash

set -eo pipefail

diff ./src/tests/qrTestsOld/circular-sqaure.png ./src/tests/qrTests/circular-sqaure.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/frame-banner-bottom.png ./src/tests/qrTests/frame-banner-bottom.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/frame-box-bottom.png ./src/tests/qrTests/frame-box-bottom.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/frame-balloon-top.png ./src/tests/qrTests/frame-balloon-top.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/circular-nologo.png ./src/tests/qrTests/circular-nologo.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/circular-kite.png ./src/tests/qrTests/circular-kite.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/circular-left-diamond.png ./src/tests/qrTests/circular-left-diamond.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/default_no_logobackground.png ./src/tests/qrTests/default_no_logobackground.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/frame-banner-top.png ./src/tests/qrTests/frame-banner-top.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/frame-banner-bottom-grad-horizontal.png ./src/tests/qrTests/frame-banner-bottom-grad-horizontal.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/default_vcard.png ./src/tests/qrTests/default_vcard.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/circular-circle.png ./src/tests/qrTests/circular-circle.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/circular-right-diamond.png ./src/tests/qrTests/circular-right-diamond.png
if [ $? -ne 0 ]; then
    exit 1
fi


diff ./src/tests/qrTestsOld/default.png ./src/tests/qrTests/default.png
if [ $? -ne 0 ]; then
    exit 1
fi