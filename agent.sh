#!/bin/sh

# Check if all dependencies required for running the agent are installed
check_deps() {
    set -f
    error() {
        echo "Error: $1 is not installed." >&2
    }

    # Check if script is being run as root
    if [ "$(id -u)" -ne 0 ]; then 
        echo "Please run as root." >&2
        exit 1
    fi
 
    dependencies="dmidecode"
    for item in $dependencies; do
        if ! [ -x "$(command -v "$item")" ]; then
            error "$item"
            exit 1 # Exit the script on error
        fi
    done

    set +f
}


get_hardware_info() {
    dmidecode_output=$(dmidecode -t 1)

    # Get UUID
    uuid=$(echo "$dmidecode_output" | grep "UUID:" | sed 's/^.*: //')

    # Get serial number
    serial=$(echo "$dmidecode_output" | grep "Serial Number:" | sed 's/^.*: //')

    # Get Manufacturer
    manufacturer=$(echo "$dmidecode_output" | grep "Manufacturer:" | sed 's/^.*: //')

    # Get product name
    product_name=$(echo "$dmidecode_output" | grep "Product Name:" | sed 's/^.*: //')
}

get_os_info() {
    # Get kernel version (and associated information)
    kernel_version=$(cat /proc/version)

    uptime=$(cat /proc/uptime | sed 's/\s.*$//')
}

check_deps

current_date=$(date +"%Y-%m-%dT%H:%M:%S%z")

get_hardware_info
get_os_info

json=$(cat <<-END
{
    "id": "${uuid}",
    "time": "${current_date}",
    "uptime": "${uptime}",
    "kernel": "${kernel_version}",
    "hardware": {"serial": "${serial}", "manufacturer": "${manufacturer}", "product": "${product_name}"}
}
END
)
echo "$json"

curl -X POST http://localhost:5000/v1/clients\
   -H 'Content-Type: application/json'\
   -d "$json"