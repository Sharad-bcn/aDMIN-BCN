import s from './styles.module.scss'

export default function Main({ color = 'var(--c-primary)', colorLight = 'var(--c-primary-light)' }) {
  // ;(color = '#578BED'), (colorLight = '#F3F7FF')
  return (
    <div className={s.main}>
      <NoData color={color} colorLight={colorLight} />
    </div>
  )
}

const NoData = props => (
  <div className={s.image}>
    <svg width='512' height='332' viewBox='0 0 512 332' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M129.024 187.84H315.392C316.446 187.84 317.474 187.726 318.464 187.51C319.454 187.726 320.481 187.84 321.536 187.84H428.032C435.949 187.84 442.368 181.422 442.368 173.504C442.368 165.586 435.949 159.168 428.032 159.168H415.744C407.826 159.168 401.408 152.75 401.408 144.832C401.408 136.914 407.826 130.496 415.744 130.496H454.656C462.573 130.496 468.992 124.078 468.992 116.16C468.992 108.242 462.573 101.824 454.656 101.824H409.6C417.517 101.824 423.936 95.4055 423.936 87.488C423.936 79.5704 417.517 73.152 409.6 73.152H278.528C286.445 73.152 292.864 66.7335 292.864 58.816C292.864 50.8984 286.445 44.48 278.528 44.48H161.792C153.874 44.48 147.456 50.8984 147.456 58.816C147.456 66.7335 153.874 73.152 161.792 73.152H79.8719C71.9544 73.152 65.5359 79.5704 65.5359 87.488C65.5359 95.4055 71.9544 101.824 79.8719 101.824H131.072C138.989 101.824 145.408 108.242 145.408 116.16C145.408 124.078 138.989 130.496 131.072 130.496H49.1519C41.2344 130.496 34.8159 136.914 34.8159 144.832C34.8159 152.75 41.2344 159.168 49.1519 159.168H129.024C121.106 159.168 114.688 165.586 114.688 173.504C114.688 181.422 121.106 187.84 129.024 187.84ZM462.848 187.84C470.765 187.84 477.184 181.422 477.184 173.504C477.184 165.586 470.765 159.168 462.848 159.168C454.93 159.168 448.512 165.586 448.512 173.504C448.512 181.422 454.93 187.84 462.848 187.84Z'
        fill={props.colorLight}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M231.667 143.412C231.507 144.545 231.424 145.703 231.424 146.88C231.424 160.453 242.427 171.456 256 171.456C269.573 171.456 280.576 160.453 280.576 146.88C280.576 145.703 280.493 144.545 280.333 143.412H339.968V198.08C339.968 201.473 337.217 204.224 333.824 204.224H178.176C174.783 204.224 172.032 201.473 172.032 198.08V143.412H231.667Z'
        fill='white'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M282.624 142.784C282.624 157.488 270.704 169.408 256 169.408C241.296 169.408 229.376 157.488 229.376 142.784C229.376 142.308 229.388 141.834 229.413 141.364H172.032L191.612 83.4715C192.456 80.9757 194.797 79.2959 197.432 79.2959H314.568C317.203 79.2959 319.544 80.9757 320.388 83.4715L339.968 141.364H282.587C282.611 141.834 282.624 142.308 282.624 142.784Z'
        fill='white'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M278.728 144.739C278.728 156.101 268.552 167.36 256 167.36C243.448 167.36 233.272 156.101 233.272 144.739C233.272 144.371 233.283 141.957 233.304 141.594H190.464L207.179 100.955C207.899 99.026 209.898 97.728 212.147 97.728H299.853C302.102 97.728 304.101 99.026 304.822 100.955L321.536 141.594H278.696C278.717 141.957 278.728 144.371 278.728 144.739Z'
        fill={props.colorLight}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M174.592 141.785V196.032C174.592 198.011 176.197 199.616 178.176 199.616H333.824C335.803 199.616 337.408 198.011 337.408 196.032V141.785L317.963 84.2917C317.471 82.8358 316.105 81.856 314.568 81.856H197.432C195.895 81.856 194.529 82.8358 194.037 84.2917L174.592 141.785Z'
        stroke={props.color}
        strokeWidth='2.5'
      />
      <path
        d='M200.704 140.736C208.766 140.736 217.467 140.736 226.806 140.736C230.648 140.736 230.648 143.436 230.648 144.832C230.648 158.405 241.905 169.408 255.79 169.408C269.675 169.408 280.931 158.405 280.931 144.832C280.931 143.436 280.931 140.736 284.774 140.736H335.872M185.495 140.736H190.464H185.495Z'
        stroke={props.color}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M307.404 32.812L284.672 58.316M254.156 24V58.316V24ZM200.704 32.812L223.436 58.316L200.704 32.812Z'
        stroke={props.color}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M60.325 262.904V295H55.015V253.11H59.499L85.105 285.855V253.169H90.415V295H85.577L60.325 262.904ZM112.525 295.59C110.204 295.59 108.1 295.177 106.212 294.351C104.324 293.486 102.691 292.325 101.315 290.87C99.9381 289.375 98.8761 287.664 98.1288 285.737C97.3815 283.81 97.0078 281.784 97.0078 279.66C97.0078 277.497 97.3815 275.451 98.1288 273.524C98.8761 271.597 99.9381 269.905 101.315 268.45C102.691 266.955 104.324 265.795 106.212 264.969C108.139 264.104 110.243 263.671 112.525 263.671C114.845 263.671 116.95 264.104 118.838 264.969C120.726 265.795 122.358 266.955 123.735 268.45C125.151 269.905 126.232 271.597 126.98 273.524C127.727 275.451 128.101 277.497 128.101 279.66C128.101 281.784 127.727 283.81 126.98 285.737C126.232 287.664 125.17 289.375 123.794 290.87C122.417 292.325 120.765 293.486 118.838 294.351C116.95 295.177 114.845 295.59 112.525 295.59ZM102.318 279.719C102.318 281.843 102.77 283.77 103.675 285.501C104.619 287.232 105.858 288.608 107.392 289.631C108.926 290.614 110.637 291.106 112.525 291.106C114.413 291.106 116.124 290.595 117.658 289.572C119.231 288.549 120.47 287.173 121.375 285.442C122.319 283.672 122.791 281.725 122.791 279.601C122.791 277.477 122.319 275.55 121.375 273.819C120.47 272.088 119.231 270.712 117.658 269.689C116.124 268.666 114.413 268.155 112.525 268.155C110.637 268.155 108.926 268.686 107.392 269.748C105.858 270.771 104.619 272.147 103.675 273.878C102.77 275.609 102.318 277.556 102.318 279.719ZM150.141 295V253.11H164.655C169.139 253.11 172.876 254.054 175.865 255.942C178.894 257.791 181.155 260.308 182.65 263.494C184.145 266.641 184.892 270.141 184.892 273.996C184.892 278.244 184.066 281.941 182.414 285.088C180.762 288.235 178.422 290.673 175.393 292.404C172.364 294.135 168.785 295 164.655 295H150.141ZM179.523 273.996C179.523 270.849 178.933 268.057 177.753 265.618C176.612 263.179 174.941 261.272 172.738 259.895C170.535 258.518 167.841 257.83 164.655 257.83H155.451V290.28H164.655C167.88 290.28 170.594 289.572 172.797 288.156C175 286.701 176.671 284.754 177.812 282.315C178.953 279.837 179.523 277.064 179.523 273.996ZM188.841 286.091C188.841 284.124 189.392 282.433 190.493 281.017C191.634 279.562 193.188 278.441 195.154 277.654C197.121 276.867 199.402 276.474 201.998 276.474C203.375 276.474 204.83 276.592 206.364 276.828C207.898 277.025 209.255 277.339 210.435 277.772V275.53C210.435 273.17 209.727 271.321 208.311 269.984C206.895 268.607 204.889 267.919 202.293 267.919C200.602 267.919 198.97 268.234 197.396 268.863C195.862 269.453 194.23 270.318 192.499 271.459L190.611 267.801C192.617 266.424 194.623 265.402 196.629 264.733C198.635 264.025 200.72 263.671 202.883 263.671C206.817 263.671 209.924 264.772 212.205 266.975C214.487 269.138 215.627 272.167 215.627 276.061V289.1C215.627 289.729 215.745 290.201 215.981 290.516C216.257 290.791 216.689 290.949 217.279 290.988V295C216.768 295.079 216.316 295.138 215.922 295.177C215.568 295.216 215.273 295.236 215.037 295.236C213.818 295.236 212.894 294.902 212.264 294.233C211.674 293.564 211.34 292.856 211.261 292.109L211.143 290.162C209.806 291.893 208.056 293.23 205.892 294.174C203.729 295.118 201.585 295.59 199.461 295.59C197.416 295.59 195.587 295.177 193.974 294.351C192.362 293.486 191.103 292.345 190.198 290.929C189.294 289.474 188.841 287.861 188.841 286.091ZM208.901 288.274C209.373 287.723 209.747 287.173 210.022 286.622C210.298 286.032 210.435 285.54 210.435 285.147V281.312C209.216 280.84 207.938 280.486 206.6 280.25C205.263 279.975 203.945 279.837 202.647 279.837C200.012 279.837 197.868 280.368 196.216 281.43C194.604 282.453 193.797 283.869 193.797 285.678C193.797 286.661 194.053 287.625 194.564 288.569C195.115 289.474 195.902 290.221 196.924 290.811C197.986 291.401 199.284 291.696 200.818 291.696C202.431 291.696 203.965 291.381 205.42 290.752C206.876 290.083 208.036 289.257 208.901 288.274ZM239.629 293.466C239.196 293.663 238.606 293.918 237.859 294.233C237.111 294.548 236.246 294.823 235.263 295.059C234.279 295.295 233.237 295.413 232.136 295.413C230.877 295.413 229.717 295.197 228.655 294.764C227.593 294.292 226.747 293.584 226.118 292.64C225.488 291.657 225.174 290.437 225.174 288.982V268.273H220.985V264.202H225.174V253.936H230.366V264.202H237.269V268.273H230.366V287.389C230.444 288.49 230.818 289.316 231.487 289.867C232.155 290.378 232.942 290.634 233.847 290.634C234.869 290.634 235.813 290.457 236.679 290.103C237.544 289.749 238.114 289.493 238.39 289.336L239.629 293.466ZM242.022 286.091C242.022 284.124 242.573 282.433 243.674 281.017C244.815 279.562 246.368 278.441 248.335 277.654C250.302 276.867 252.583 276.474 255.179 276.474C256.556 276.474 258.011 276.592 259.545 276.828C261.079 277.025 262.436 277.339 263.616 277.772V275.53C263.616 273.17 262.908 271.321 261.492 269.984C260.076 268.607 258.07 267.919 255.474 267.919C253.783 267.919 252.15 268.234 250.577 268.863C249.043 269.453 247.411 270.318 245.68 271.459L243.792 267.801C245.798 266.424 247.804 265.402 249.81 264.733C251.816 264.025 253.901 263.671 256.064 263.671C259.997 263.671 263.105 264.772 265.386 266.975C267.667 269.138 268.808 272.167 268.808 276.061V289.1C268.808 289.729 268.926 290.201 269.162 290.516C269.437 290.791 269.87 290.949 270.46 290.988V295C269.949 295.079 269.496 295.138 269.103 295.177C268.749 295.216 268.454 295.236 268.218 295.236C266.999 295.236 266.074 294.902 265.445 294.233C264.855 293.564 264.521 292.856 264.442 292.109L264.324 290.162C262.987 291.893 261.236 293.23 259.073 294.174C256.91 295.118 254.766 295.59 252.642 295.59C250.597 295.59 248.768 295.177 247.155 294.351C245.542 293.486 244.284 292.345 243.379 290.929C242.474 289.474 242.022 287.861 242.022 286.091ZM262.082 288.274C262.554 287.723 262.928 287.173 263.203 286.622C263.478 286.032 263.616 285.54 263.616 285.147V281.312C262.397 280.84 261.118 280.486 259.781 280.25C258.444 279.975 257.126 279.837 255.828 279.837C253.193 279.837 251.049 280.368 249.397 281.43C247.784 282.453 246.978 283.869 246.978 285.678C246.978 286.661 247.234 287.625 247.745 288.569C248.296 289.474 249.082 290.221 250.105 290.811C251.167 291.401 252.465 291.696 253.999 291.696C255.612 291.696 257.146 291.381 258.601 290.752C260.056 290.083 261.217 289.257 262.082 288.274ZM292.859 295V253.11H320.53V257.83H298.169V271.813H316.99V276.238H298.169V295H292.859ZM337.981 295.59C335.66 295.59 333.556 295.177 331.668 294.351C329.78 293.486 328.148 292.325 326.771 290.87C325.394 289.375 324.332 287.664 323.585 285.737C322.838 283.81 322.464 281.784 322.464 279.66C322.464 277.497 322.838 275.451 323.585 273.524C324.332 271.597 325.394 269.905 326.771 268.45C328.148 266.955 329.78 265.795 331.668 264.969C333.595 264.104 335.7 263.671 337.981 263.671C340.302 263.671 342.406 264.104 344.294 264.969C346.182 265.795 347.814 266.955 349.191 268.45C350.607 269.905 351.689 271.597 352.436 273.524C353.183 275.451 353.557 277.497 353.557 279.66C353.557 281.784 353.183 283.81 352.436 285.737C351.689 287.664 350.627 289.375 349.25 290.87C347.873 292.325 346.221 293.486 344.294 294.351C342.406 295.177 340.302 295.59 337.981 295.59ZM327.774 279.719C327.774 281.843 328.226 283.77 329.131 285.501C330.075 287.232 331.314 288.608 332.848 289.631C334.382 290.614 336.093 291.106 337.981 291.106C339.869 291.106 341.58 290.595 343.114 289.572C344.687 288.549 345.926 287.173 346.831 285.442C347.775 283.672 348.247 281.725 348.247 279.601C348.247 277.477 347.775 275.55 346.831 273.819C345.926 272.088 344.687 270.712 343.114 269.689C341.58 268.666 339.869 268.155 337.981 268.155C336.093 268.155 334.382 268.686 332.848 269.748C331.314 270.771 330.075 272.147 329.131 273.878C328.226 275.609 327.774 277.556 327.774 279.719ZM359.553 282.669V264.202H364.745V281.666C364.745 284.813 365.296 287.173 366.397 288.746C367.499 290.319 369.131 291.106 371.294 291.106C372.71 291.106 374.067 290.811 375.365 290.221C376.703 289.592 377.902 288.707 378.964 287.566C380.026 286.425 380.852 285.068 381.442 283.495V264.202H386.634V289.1C386.634 289.729 386.752 290.201 386.988 290.516C387.264 290.791 387.696 290.949 388.286 290.988V295C387.696 295.079 387.224 295.118 386.87 295.118C386.556 295.157 386.241 295.177 385.926 295.177C384.943 295.177 384.097 294.882 383.389 294.292C382.681 293.663 382.308 292.896 382.268 291.991L382.15 288.392C380.813 290.673 379.004 292.443 376.722 293.702C374.48 294.961 372.022 295.59 369.347 295.59C366.122 295.59 363.683 294.508 362.031 292.345C360.379 290.142 359.553 286.917 359.553 282.669ZM422.01 295H416.818V277.772C416.818 274.507 416.306 272.128 415.284 270.633C414.3 269.099 412.786 268.332 410.741 268.332C409.325 268.332 407.909 268.686 406.493 269.394C405.116 270.102 403.877 271.066 402.776 272.285C401.714 273.465 400.947 274.842 400.475 276.415V295H395.283V264.202H400.003V270.81C400.829 269.355 401.891 268.096 403.189 267.034C404.487 265.972 405.962 265.146 407.614 264.556C409.266 263.966 410.996 263.671 412.806 263.671C414.576 263.671 416.051 264.005 417.231 264.674C418.45 265.303 419.394 266.208 420.063 267.388C420.771 268.529 421.262 269.886 421.538 271.459C421.852 273.032 422.01 274.743 422.01 276.592V295ZM428.078 279.66C428.078 276.749 428.668 274.094 429.848 271.695C431.067 269.256 432.719 267.309 434.804 265.854C436.928 264.399 439.347 263.671 442.061 263.671C444.539 263.671 446.761 264.32 448.728 265.618C450.694 266.916 452.228 268.489 453.33 270.338V251.93H458.522V289.1C458.522 289.729 458.64 290.201 458.876 290.516C459.151 290.791 459.584 290.949 460.174 290.988V295C459.19 295.157 458.423 295.236 457.873 295.236C456.85 295.236 455.945 294.882 455.159 294.174C454.411 293.466 454.038 292.679 454.038 291.814V289.218C452.818 291.185 451.186 292.738 449.141 293.879C447.095 295.02 444.971 295.59 442.769 295.59C440.645 295.59 438.678 295.177 436.869 294.351C435.099 293.486 433.545 292.306 432.208 290.811C430.91 289.316 429.887 287.625 429.14 285.737C428.432 283.81 428.078 281.784 428.078 279.66ZM453.33 284.203V275.353C452.858 274.016 452.091 272.816 451.029 271.754C449.967 270.653 448.767 269.787 447.43 269.158C446.132 268.489 444.834 268.155 443.536 268.155C442.002 268.155 440.605 268.489 439.347 269.158C438.127 269.787 437.065 270.653 436.161 271.754C435.295 272.816 434.627 274.035 434.155 275.412C433.683 276.789 433.447 278.224 433.447 279.719C433.447 281.253 433.702 282.708 434.214 284.085C434.764 285.462 435.512 286.681 436.456 287.743C437.439 288.805 438.56 289.631 439.819 290.221C441.117 290.811 442.513 291.106 444.008 291.106C444.952 291.106 445.915 290.929 446.899 290.575C447.921 290.221 448.885 289.729 449.79 289.1C450.694 288.471 451.461 287.743 452.091 286.917C452.72 286.052 453.133 285.147 453.33 284.203Z'
        fill={props.color}
      />
    </svg>
  </div>
)
